import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /api/dashboard/shopkeeper
 */
export const getShopkeeperDashboard = async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { userId: req.user.userId },
      select: { id: true, name: true },
    });
    if (!shop) return sendError(res, 'Shop not found', 404);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayOrderCount, todayRevenueAgg, pendingCount, totalOrderCount, lowStockProducts, recentOrders] =
      await prisma.$transaction([
        prisma.order.count({ where: { shopId: shop.id, createdAt: { gte: todayStart } } }),
        prisma.order.aggregate({
          where: { shopId: shop.id, status: 'Delivered', updatedAt: { gte: todayStart } },
          _sum: { totalAmount: true },
        }),
        prisma.order.count({ where: { shopId: shop.id, status: 'Pending' } }),
        prisma.order.count({ where: { shopId: shop.id } }),
        prisma.product.findMany({
          where: { shopId: shop.id, stock: { lt: 10 }, isAvailable: true },
          select: { id: true, name: true, stock: true, category: true },
          orderBy: { stock: 'asc' },
          take: 10,
        }),
        prisma.order.findMany({
          where: { shopId: shop.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: { include: { product: { select: { name: true } } } } },
        }),
      ]);

    // groupBy must run outside $transaction in Prisma 5
    const statusBreakdown = await prisma.order.groupBy({
      by: ['status'],
      where: { shopId: shop.id },
      orderBy: { status: 'asc' },
      _count: { _all: true },
    });

    return sendSuccess(res, {
      shop: { id: shop.id, name: shop.name },
      kpis: {
        todayOrders: todayOrderCount,
        todayRevenue: todayRevenueAgg._sum.totalAmount ?? 0,
        pendingOrders: pendingCount,
        totalOrders: totalOrderCount,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders,
      orderStatusBreakdown: statusBreakdown.reduce((acc, s) => {
        acc[s.status] = s._count._all;
        return acc;
      }, {}),
    }, 'Shopkeeper dashboard data fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch dashboard', 500, err.message);
  }
};
