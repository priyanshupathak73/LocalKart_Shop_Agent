import { Router } from 'express';
import { getMyShop, updateShop } from '../controllers/shop.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { shopUpdateSchema } from '../schemas/product.schema.js';

const router = Router();

// All shop routes require SHOPKEEPER role
router.use(authenticate, authorize('SHOPKEEPER'));

router.get('/my-shop', getMyShop);
router.put('/update', validate(shopUpdateSchema), updateShop);

export default router;
