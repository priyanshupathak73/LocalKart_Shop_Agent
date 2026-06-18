const { Router } = require('express');
const {
  getOrderById,
  getShopOrders,
  acceptOrder,
  rejectOrder,
  getAvailableOrders,
  getDeliveryOrders,
  pickupOrder,
  updateDeliveryStatus,
} = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { updateOrderStatusSchema } = require('../schemas/order.schema');

const router = Router();

// Shared: get single order (both roles can view)
router.get('/:id', authenticate, getOrderById);

// ── Shopkeeper routes ──
router.get('/', authenticate, authorize('SHOPKEEPER'), getShopOrders);
router.put('/:id/accept', authenticate, authorize('SHOPKEEPER'), acceptOrder);
router.put('/:id/reject', authenticate, authorize('SHOPKEEPER'), rejectOrder);

// ── Delivery partner routes ──
router.get('/delivery/available', authenticate, authorize('DELIVERY_PARTNER'), getAvailableOrders);
router.get('/delivery/my-orders', authenticate, authorize('DELIVERY_PARTNER'), getDeliveryOrders);
router.put('/:id/pickup', authenticate, authorize('DELIVERY_PARTNER'), pickupOrder);
router.put(
  '/:id/status',
  authenticate,
  authorize('DELIVERY_PARTNER'),
  validate(updateOrderStatusSchema),
  updateDeliveryStatus
);

module.exports = router;
