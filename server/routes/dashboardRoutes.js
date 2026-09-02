const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/driver', protect, authorize('DRIVER', 'ADMIN'), dashboardController.getDriverDashboard);
router.get('/operator', protect, authorize('OPERATOR', 'ADMIN'), dashboardController.getOperatorDashboard);
router.get('/admin', protect, authorize('ADMIN'), dashboardController.getAdminDashboard);

module.exports = router;
