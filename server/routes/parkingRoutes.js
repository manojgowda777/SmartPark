const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', parkingController.getAllParkingLocations);
router.get('/:id', parkingController.getParkingLocationById);
router.get('/:id/slots', parkingController.getParkingSlots);

module.exports = router;
