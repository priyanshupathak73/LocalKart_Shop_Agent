const { Router } = require('express');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryLogs,
} = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../schemas/product.schema');

const router = Router();

// All product routes require SHOPKEEPER role
router.use(authenticate, authorize('SHOPKEEPER'));

router.get('/', getProducts);
router.post('/', validate(createProductSchema), createProduct);
router.get('/:id', getProductById);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/inventory-logs', getInventoryLogs);

module.exports = router;
