import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateAvailability,
  getEarnings,
  getDeliveryDashboard,
} from '../controllers/delivery.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { deliveryAvailabilitySchema } from '../schemas/order.schema.js';

const router = Router();

// All delivery routes require DELIVERY_PARTNER role
router.use(authenticate, authorize('DELIVERY_PARTNER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/availability', validate(deliveryAvailabilitySchema), updateAvailability);
router.get('/earnings', getEarnings);
router.get('/dashboard', getDeliveryDashboard);

export default router;
