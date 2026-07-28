import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/shop/my-shop
 */
export const getMyShop = async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { userId: req.user.userId },
      include: {
        _count: { select: { products: true, orders: true } },
      },
    });
    if (!shop) return sendError(res, 'Shop not found. Please complete your shop setup.', 404);
    return sendSuccess(res, shop, 'Shop fetched successfully');
  } catch (err) {
    return sendError(res, 'Failed to fetch shop', 500, err.message);
  }
};

/**
 * PUT /api/shop/update
 */
export const updateShop = async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId } });
    if (!shop) return sendError(res, 'Shop not found', 404);

    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: req.body,
    });
    return sendSuccess(res, updated, 'Shop updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update shop', 500, err.message);
  }
};
