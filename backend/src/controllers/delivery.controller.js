import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/delivery/profile
 */
export const getProfile = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);
    return sendSuccess(res, dp, 'Profile fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch profile', 500, err.message);
  }
};

/**
 * PUT /api/delivery/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { vehicleType } = req.body;
    const dp = await prisma.deliveryPartner.update({
      where: { userId: req.user.userId },
      data: { ...(vehicleType && { vehicleType }) },
    });
    return sendSuccess(res, dp, 'Profile updated');
  } catch (err) {
    return sendError(res, 'Failed to update profile', 500, err.message);
  }
};

/**
 * PUT /api/delivery/availability
 */
export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const dp = await prisma.deliveryPartner.update({
      where: { userId: req.user.userId },
      data: { isAvailable },
    });
    return sendSuccess(res, dp, `You are now ${isAvailable ? 'online' : 'offline'}`);
  } catch (err) {
    return sendError(res, 'Failed to update availability', 500, err.message);
  }
};

/**
 * GET /api/delivery/earnings
 */
export const getEarnings = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: req.user.userId },
      select: { id: true, totalEarnings: true, totalDeliveries: true, rating: true },
    });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
      where: { deliveryPartnerId: dp.id, status: 'Delivered', updatedAt: { gte: todayStart } },
      select: { deliveryFee: true, id: true, updatedAt: true },
    });

    const todayEarnings = todayOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

    const recentDeliveries = await prisma.order.findMany({
      where: { deliveryPartnerId: dp.id, status: 'Delivered' },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { id: true, deliveryFee: true, customerName: true, deliveryAddress: true, updatedAt: true },
    });

    return sendSuccess(res, {
      totalEarnings: dp.totalEarnings,
      totalDeliveries: dp.totalDeliveries,
      rating: dp.rating,
      todayEarnings,
      todayDeliveries: todayOrders.length,
      recentDeliveries,
    }, 'Earnings fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch earnings', 500, err.message);
  }
};

/**
 * GET /api/delivery/dashboard
 */
export const getDeliveryDashboard = async (req, res) => {
  try {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true } } },
    });
    if (!dp) return sendError(res, 'Delivery profile not found', 404);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const activeOrders = await prisma.order.findMany({
      where: { deliveryPartnerId: dp.id, status: { in: ['PickedUp', 'InTransit'] } },
      include: {
        shop: { select: { name: true, address: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });

    const availableCount = await prisma.order.count({
      where: { status: 'Accepted', deliveryPartnerId: null },
    });

    const [todayDeliveries, todayEarningsAgg] = await prisma.$transaction([
      prisma.order.count({
        where: { deliveryPartnerId: dp.id, status: 'Delivered', updatedAt: { gte: todayStart } },
      }),
      prisma.order.aggregate({
        where: { deliveryPartnerId: dp.id, status: 'Delivered', updatedAt: { gte: todayStart } },
        _sum: { deliveryFee: true },
      }),
    ]);

    return sendSuccess(res, {
      agent: {
        name: dp.user.name,
        vehicleType: dp.vehicleType,
        isAvailable: dp.isAvailable,
        rating: dp.rating,
      },
      today: {
        deliveries: todayDeliveries,
        earnings: todayEarningsAgg._sum.deliveryFee ?? 0,
      },
      activeOrders,
      availableCount,
      allTime: { totalDeliveries: dp.totalDeliveries, totalEarnings: dp.totalEarnings },
    }, 'Dashboard data fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch dashboard', 500, err.message);
  }
};
