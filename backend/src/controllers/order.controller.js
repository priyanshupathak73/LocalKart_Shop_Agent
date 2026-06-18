const { prisma } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { getIO } = require('../config/socket');

// ─── Shared ──────────────────────────────────────────────────────────────────

const getOrderById = async (req, res) => {
  try {
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

// ─── Shopkeeper ───────────────────────────────────────────────────────────────

/**
 * GET /api/orders  (SHOPKEEPER)
 */
const getShopOrders = async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { userId: req.user.userId },
      select: { id: true },
    });
    if (!shop) return sendError(res, 'Shop not found', 404);

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));

    const where = {
      shopId: shop.id,
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
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId }, select: { id: true } });
    const order = await prisma.order.findFirst({ where: { id: req.params.id, shopId: shop?.id } });

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
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId }, select: { id: true } });
    const order = await prisma.order.findFirst({ where: { id: req.params.id, shopId: shop?.id } });

    if (!order) return sendError(res, 'Order not found', 404);
    if (!['Pending', 'Accepted'].includes(order.status)) {
      return sendError(res, `Cannot reject order with status: ${order.status}`, 400);
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'Cancelled' },
    });

    getIO().emit('order:statusUpdate', { orderId: order.id, status: 'Cancelled' });
    return sendSuccess(res, updated, 'Order rejected/cancelled');
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

module.exports = {
  getOrderById,
  getShopOrders,
  acceptOrder,
  rejectOrder,
  getAvailableOrders,
  getDeliveryOrders,
  pickupOrder,
  updateDeliveryStatus,
};
