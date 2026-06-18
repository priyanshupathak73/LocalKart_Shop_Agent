const { Router } = require('express');
const { getShopkeeperDashboard } = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = Router();

router.get('/shopkeeper', authenticate, authorize('SHOPKEEPER'), getShopkeeperDashboard);

module.exports = router;
