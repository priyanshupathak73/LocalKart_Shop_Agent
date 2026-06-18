const { Router } = require('express');
const { getMyShop, updateShop } = require('../controllers/shop.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { shopUpdateSchema } = require('../schemas/product.schema');

const router = Router();

// All shop routes require SHOPKEEPER role
router.use(authenticate, authorize('SHOPKEEPER'));

router.get('/my-shop', getMyShop);
router.put('/update', validate(shopUpdateSchema), updateShop);

module.exports = router;
