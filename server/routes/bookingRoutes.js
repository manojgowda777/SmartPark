const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookingController.createBooking);
router.post('/create-order', protect, bookingController.createRazorpayOrder);
router.post('/verify-payment', protect, bookingController.verifyPaymentAndBook);
router.put('/:id/cancel', protect, bookingController.cancelBooking);
router.get('/test-email', bookingController.testEmail);
router.get('/test-resend', bookingController.testResend);

module.exports = router;
