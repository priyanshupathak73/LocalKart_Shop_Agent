import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryLogs,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema.js';

const router = Router();

// All product routes require SHOPKEEPER role
router.use(authenticate, authorize('SHOPKEEPER'));

router.get('/', getProducts);
router.post('/', validate(createProductSchema), createProduct);
router.get('/:id', getProductById);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/inventory-logs', getInventoryLogs);

export default router;
