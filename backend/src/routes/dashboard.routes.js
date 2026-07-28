import { Router } from 'express';
import { getShopkeeperDashboard } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/shopkeeper', authenticate, authorize('SHOPKEEPER'), getShopkeeperDashboard);

export default router;
