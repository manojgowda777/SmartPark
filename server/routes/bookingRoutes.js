const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookingController.createBooking);
router.put('/:id/cancel', protect, bookingController.cancelBooking);
router.get('/test-email', bookingController.testEmail);

module.exports = router;
