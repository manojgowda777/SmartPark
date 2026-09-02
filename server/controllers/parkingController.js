const db = require('../config/db');

// @route   GET /api/parking
exports.getAllParkingLocations = async (req, res) => {
    try {
        const [locations] = await db.query('SELECT * FROM parking_locations WHERE status = "ACTIVE"');
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching parking locations.' });
    }
};

// @route   GET /api/parking/:id
exports.getParkingLocationById = async (req, res) => {
    try {
        const [locations] = await db.query('SELECT * FROM parking_locations WHERE id = ?', [req.params.id]);
        if (locations.length === 0) {
            return res.status(404).json({ message: 'Parking location not found.' });
        }
        res.json(locations[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching parking details.' });
    }
};

// @route   GET /api/parking/:id/slots
exports.getParkingSlots = async (req, res) => {
    try {
        const [slots] = await db.query('SELECT * FROM parking_slots WHERE parking_location_id = ? ORDER BY slot_number', [req.params.id]);
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching slots.' });
    }
};
