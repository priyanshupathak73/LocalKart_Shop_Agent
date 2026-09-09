import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getIO } from '../config/socket.js';

// Helper to check valid 24-hex ObjectId string
const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

// In-memory cache for shopId to eliminate redundant DB round-trips
const shopIdCache = new Map();
const getShopId = async (userId) => {
  if (shopIdCache.has(userId)) {
    return shopIdCache.get(userId);
  }
  const shop = await prisma.shop.findUnique({ where: { userId }, select: { id: true } });
  if (shop) {
    shopIdCache.set(userId, shop.id);
    setTimeout(() => shopIdCache.delete(userId), 5 * 60 * 1000);
    return shop.id;
  }
  return null;
};

// ─── Shared ──────────────────────────────────────────────────────────────────

const getOrderById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return sendError(res, 'Order not found', 404);
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, imageUrl: true } } } },
        shop: { select: { id: true, name: true, address: true, phone: true } },
        deliveryPartner: {
          include: { user: { select: { name: true, phone: true } } },
        },
      },
    });
    if (!order) return sendError(res, 'Order not found', 404);
    return sendSuccess(res, order, 'Order fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch order', 500, err.message);
  }
};

// ─── Customer ────────────────────────────────────────────────────────────────

/**
 * POST /api/orders  (CUSTOMER / AUTHENTICATED USER)
 */
const createOrder = async (req, res) => {
  try {
    const { shopId, customerName, customerPhone, deliveryAddress, notes, items } = req.body;

    // 1. Verify shopId format and shop existence
    if (!isValidObjectId(shopId)) {
      return sendError(res, 'Invalid shop ID format', 400);
    }
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { id: true, isActive: true },
    });
    if (!shop) {
      return sendError(res, 'Shop not found', 404);
    }
    if (!shop.isActive) {
      return sendError(res, 'Shop is currently inactive', 400);
    }

    // 2. Fetch all requested products
    const productIds = items.map((i) => i.productId);
    for (const pid of productIds) {
      if (!isValidObjectId(pid)) {
        return sendError(res, `Invalid product ID format: ${pid}`, 400);
      }
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 3. Verify product existence, shop ownership, stock & calculate price on backend
    let itemsTotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return sendError(res, `Product not found: ${item.productId}`, 404);
      }
      if (product.shopId !== shopId) {
        return sendError(res, `Product "${product.name}" does not belong to shop ${shopId}`, 400);
      }
      if (product.stock < item.quantity) {
        return sendError(
          res,
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          400
        );
      }
      itemsTotal += product.price * item.quantity;
    }

    const deliveryFee = 40.0;
    const totalAmount = itemsTotal + deliveryFee;

    // 4. Use Prisma transaction for atomic order creation, items, stock reduction, & inventory logging
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Re-verify stock inside transaction for concurrency safety
      for (const item of items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (!prod || prod.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${prod ? prod.name : item.productId}`);
        }
      }

      // Create Order and OrderItems
      const order = await tx.order.create({
        data: {
          shopId,
          status: 'Pending',
          totalAmount,
          deliveryFee,
          customerName,
          customerPhone,
          deliveryAddress,
          notes,
          items: {
            create: items.map((item) => {
              const prod = productMap.get(item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: prod.price,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true, imageUrl: true },
              },
            },
          },
          shop: {
            select: { id: true, name: true, address: true, phone: true },
          },
        },
      });

      // Update stock and create inventory log for each item
      for (const item of items) {
        const prod = productMap.get(item.productId);
        const newStock = prod.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeAmount: -item.quantity,
            reason: `Customer Order #${order.id}`,
            stockBefore: prod.stock,
            stockAfter: newStock,
          },
        });
      }

      return order;
    });

    // Notify via Socket.io
    try {
      getIO().emit('order:created', { orderId: createdOrder.id, shopId: createdOrder.shopId });
    } catch {
      // socket failover
    }

    return sendSuccess(res, createdOrder, 'Order created successfully', 201);
  } catch (err) {
    if (err.message && err.message.startsWith('INSUFFICIENT_STOCK:')) {
      const prodName = err.message.split(':')[1];
      return sendError(res, `Insufficient stock for product "${prodName}"`, 400);
    }
    return sendError(res, 'Failed to create order', 500, err.message);
  }
};

// ─── Shopkeeper ───────────────────────────────────────────────────────────────

/**
 * GET /api/orders  (SHOPKEEPER)
 */
const getShopOrders = async (req, res) => {
  try {
    const shopId = await getShopId(req.user.userId);
    if (!shopId) return sendError(res, 'Shop not found', 404);

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));

    const where = {
      shopId,
      ...(status && { status }),
    };

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true } } } },
          deliveryPartner: { include: { user: { select: { name: true, phone: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    return sendSuccess(res, orders, 'Orders fetched', 200, { total, page: pageNum, limit: limitNum });
  } catch (err) {
    return sendError(res, 'Failed to fetch orders', 500, err.message);
  }
};

/**
 * PUT /api/orders/:id/accept  (SHOPKEEPER)
 */
const acceptOrder = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return sendError(res, 'Order not found', 404);
    const shopId = await getShopId(req.user.userId);
    const order = await prisma.order.findFirst({ where: { id: req.params.id, shopId } });

    if (!order) return sendError(res, 'Order not found', 404);
    if (order.status !== 'Pending') {
      return sendError(res, `Cannot accept order with status: ${order.status}`, 400);
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'Accepted' },
    });

    getIO().emit('order:accepted', { orderId: order.id, shopId: shop?.id });
    return sendSuccess(res, updated, 'Order accepted');
  } catch (err) {
    return sendError(res, 'Failed to accept order', 500, err.message);
  }
};

/**
 * PUT /api/orders/:id/reject  (SHOPKEEPER)
 */
const rejectOrder = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return sendError(res, 'Order not found', 404);
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId }, select: { id: true } });
    const order = await prisma.order.findFirst({ where: { id: req.params.id, shopId: shop?.id } });

    if (!order) return sendError(res, 'Order not found', 404);
    if (!['Pending', 'Accepted'].includes(order.status)) {
      return sendError(res, `Cannot reject order with status: ${order.status}`, 400);
    }
    if (order.status === 'Cancelled') {
      return sendError(res, 'Order is already cancelled', 400);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId: order.id } });

      for (const item of items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          const newStock = prod.stock + item.quantity;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock }
          });
          await tx.inventoryLog.create({
            data: {
              productId: item.productId,
              changeAmount: item.quantity,
              reason: `Order Rejection #${order.id}`,
              stockBefore: prod.stock,
              stockAfter: newStock
            }
          });
        }
      }

      return await tx.order.update({
        where: { id: order.id },
        data: { status: 'Cancelled' }
      });
    });

    getIO().emit('order:statusUpdate', { orderId: order.id, status: 'Cancelled' });
    return sendSuccess(res, updated, 'Order rejected/cancelled and stock restored');
  } catch (err) {
    return sendError(res, 'Failed to reject order', 500, err.message);
  }
};

// ─── Delivery Partner ─────────────────────────────────────────────────────────

/**
 * GET /api/orders/delivery/available  (DELIVERY_PARTNER)
 */
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'Accepted', deliveryPartnerId: null },
      include: {
        shop: { select: { name: true, address: true, phone: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return sendSuccess(res, orders, 'Available orders fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch available orders', 500, err.message);
  }
};

/**
 * GET /api/orders/delivery/my-orders  (DELIVERY_PARTNER)
 */
const getDeliveryOrders = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: req.user.userId },
      select: { id: true },
    });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);

    const { status } = req.query;
    const orders = await prisma.order.findMany({
      where: {
        deliveryPartnerId: dp.id,
        ...(status && { status }),
      },
      include: {
        shop: { select: { name: true, address: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return sendSuccess(res, orders, 'Your orders fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch orders', 500, err.message);
  }
};

/**
 * PUT /api/orders/:id/pickup  (DELIVERY_PARTNER)
 */
const pickupOrder = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: req.user.userId },
      select: { id: true },
    });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return sendError(res, 'Order not found', 404);
    if (order.status !== 'Accepted') {
      return sendError(res, `Cannot pick up order with status: ${order.status}`, 400);
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PickedUp', deliveryPartnerId: dp.id },
    });

    getIO().emit('order:statusUpdate', { orderId: order.id, status: 'PickedUp', deliveryPartnerId: dp.id });
    return sendSuccess(res, updated, 'Order picked up — now in transit');
  } catch (err) {
    return sendError(res, 'Failed to pick up order', 500, err.message);
  }
};

/**
 * PUT /api/orders/:id/status  (DELIVERY_PARTNER)
 */
const updateDeliveryStatus = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({ where: { userId: req.user.userId } });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);

    const { status } = req.body;
    const allowedTransitions = {
      PickedUp: ['InTransit'],
      InTransit: ['Delivered'],
    };

    const order = await prisma.order.findFirst({
      where: { id: req.params.id, deliveryPartnerId: dp.id },
    });
    if (!order) return sendError(res, 'Order not found or not assigned to you', 404);

    const allowed = allowedTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      return sendError(res, `Cannot transition from ${order.status} to ${status}`, 400);
    }

    const updated = await prisma.order.update({ where: { id: order.id }, data: { status } });

    if (status === 'Delivered') {
      await prisma.deliveryPartner.update({
        where: { id: dp.id },
        data: {
          totalDeliveries: { increment: 1 },
          totalEarnings: { increment: order.deliveryFee },
        },
      });
    }

    getIO().emit('order:statusUpdate', { orderId: order.id, status });
    return sendSuccess(res, updated, `Order status updated to ${status}`);
  } catch (err) {
    return sendError(res, 'Failed to update order status', 500, err.message);
  }
};

export {
  createOrder,
  getOrderById,
  getShopOrders,
  acceptOrder,
  rejectOrder,
  getAvailableOrders,
  getDeliveryOrders,
  pickupOrder,
  updateDeliveryStatus,
};
