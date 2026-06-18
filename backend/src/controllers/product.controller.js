const { prisma } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// Helper: get shopId for the authenticated user
const getShopId = async (userId) => {
  const shop = await prisma.shop.findUnique({ where: { userId }, select: { id: true } });
  return shop ? shop.id : null;
};

/**
 * GET /api/products
 * Optional query: ?category=&lowStock=true&page=1&limit=20
 */
const getProducts = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    if (!shopId) return sendError(res, 'Shop not found', 404);

    const { category, lowStock, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const where = {
      shopId,
      ...(category && { category }),
      ...(lowStock === 'true' && { stock: { lt: 10 } }),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    return sendSuccess(res, products, 'Products fetched', 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch products', 500, err.message);
  }
};

/**
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    if (!shopId) return sendError(res, 'Shop not found', 404);

    const product = await prisma.product.create({
      data: { ...req.body, shopId },
    });

    // Log initial stock
    if (product.stock > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          changeAmount: product.stock,
          reason: 'Initial stock on product creation',
          stockBefore: 0,
          stockAfter: product.stock,
        },
      });
    }

    return sendSuccess(res, product, 'Product created successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to create product', 500, err.message);
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, ...(shopId && { shopId }) },
      include: {
        inventoryLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!product) return sendError(res, 'Product not found', 404);
    return sendSuccess(res, product, 'Product fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch product', 500, err.message);
  }
};

/**
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, ...(shopId && { shopId }) },
    });
    if (!existing) return sendError(res, 'Product not found', 404);

    // Log stock change if stock differs
    if (req.body.stock !== undefined && req.body.stock !== existing.stock) {
      await prisma.inventoryLog.create({
        data: {
          productId: existing.id,
          changeAmount: req.body.stock - existing.stock,
          reason: req.body.stockReason || 'Manual stock update',
          stockBefore: existing.stock,
          stockAfter: req.body.stock,
        },
      });
    }

    const { stockReason, ...updateData } = req.body;
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });
    return sendSuccess(res, updated, 'Product updated');
  } catch (err) {
    return sendError(res, 'Failed to update product', 500, err.message);
  }
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, ...(shopId && { shopId }) },
    });
    if (!existing) return sendError(res, 'Product not found', 404);

    await prisma.product.delete({ where: { id: req.params.id } });
    return sendSuccess(res, { id: req.params.id }, 'Product deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete product', 500, err.message);
  }
};

/**
 * GET /api/products/:id/inventory-logs
 */
const getInventoryLogs = async (req, res) => {
  try {
    const logs = await prisma.inventoryLog.findMany({
      where: { productId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return sendSuccess(res, logs, 'Inventory logs fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch logs', 500, err.message);
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryLogs,
};
