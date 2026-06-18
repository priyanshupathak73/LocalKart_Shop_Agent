const { Router } = require('express');
const {
  getProfile,
  updateProfile,
  updateAvailability,
  getEarnings,
  getDeliveryDashboard,
} = require('../controllers/delivery.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { deliveryAvailabilitySchema } = require('../schemas/order.schema');

const router = Router();

// All delivery routes require DELIVERY_PARTNER role
router.use(authenticate, authorize('DELIVERY_PARTNER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/availability', validate(deliveryAvailabilitySchema), updateAvailability);
router.get('/earnings', getEarnings);
router.get('/dashboard', getDeliveryDashboard);

module.exports = router;
