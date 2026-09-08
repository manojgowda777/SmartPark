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
        const parkingId = req.params.id;
        const { date, time, duration } = req.query;

        // 1. Get all slots for this location
        const [slots] = await db.query('SELECT * FROM parking_slots WHERE parking_location_id = ? ORDER BY slot_number', [parkingId]);

        // 2. If date/time/duration are provided, dynamically filter availability
        if (date && time && duration) {
            const startHour = parseInt(time.split(':')[0]);
            const endHour = (startHour + parseInt(duration)) % 24;
            
            const startTimeStr = `${startHour.toString().padStart(2, '0')}:00:00`;
            const endTimeStr = `${endHour.toString().padStart(2, '0')}:00:00`;

            // Overlap logic: existing_start < requested_end AND existing_end > requested_start
            const overlapQuery = `
                SELECT slot_id FROM bookings 
                WHERE parking_location_id = ? 
                AND booking_date = ? 
                AND booking_status = 'CONFIRMED'
                AND start_time < ? 
                AND end_time > ?
            `;
            const [overlappingBookings] = await db.query(overlapQuery, [parkingId, date, endTimeStr, startTimeStr]);
            
            const bookedSlotIds = overlappingBookings.map(b => b.slot_id);

            // Dynamically override slot status based on real-time booking overlap
            slots.forEach(slot => {
                if (bookedSlotIds.includes(slot.id)) {
                    slot.status = 'BOOKED';
                } else if (slot.status === 'BOOKED') {
                    // Temporarily unlock it in the UI if it's booked for a different time
                    slot.status = 'AVAILABLE'; 
                }
            });
        }

        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching slots.' });
    }
};
