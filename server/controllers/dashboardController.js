const db = require('../config/db');

// @route   GET /api/dashboard/driver
exports.getDriverDashboard = async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, p.name as parking_name, s.slot_number 
            FROM bookings b
            JOIN parking_locations p ON b.parking_location_id = p.id
            JOIN parking_slots s ON b.slot_id = s.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);

        res.json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching driver dashboard.' });
    }
};

// @route   GET /api/dashboard/operator
exports.getOperatorDashboard = async (req, res) => {
    try {
        // Simple aggregate for the operator's parking locations
        const [stats] = await db.query(`
            SELECT 
                COUNT(b.id) as total_bookings,
                SUM(b.amount) as total_revenue
            FROM bookings b
            JOIN parking_locations p ON b.parking_location_id = p.id
            WHERE p.operator_id = ?
        `, [req.user.id]);

        const [recentBookings] = await db.query(`
            SELECT b.*, p.name as parking_name, s.slot_number, u.name as driver_name, v.vehicle_number 
            FROM bookings b
            JOIN parking_locations p ON b.parking_location_id = p.id
            JOIN parking_slots s ON b.slot_id = s.id
            JOIN users u ON b.user_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE p.operator_id = ?
            ORDER BY b.created_at DESC
            LIMIT 10
        `, [req.user.id]);

        res.json({ 
            stats: stats[0], 
            recentBookings 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching operator dashboard.' });
    }
};

// @route   GET /api/dashboard/admin
exports.getAdminDashboard = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="DRIVER"');
        const [opCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="OPERATOR"');
        const [locCount] = await db.query('SELECT COUNT(*) as count FROM parking_locations');
        const [bookingStats] = await db.query('SELECT COUNT(*) as total_bookings, SUM(amount) as total_revenue FROM bookings WHERE payment_status="PAID"');

        res.json({
            total_drivers: userCount[0].count,
            total_operators: opCount[0].count,
            total_locations: locCount[0].count,
            total_bookings: bookingStats[0].total_bookings || 0,
            total_revenue: bookingStats[0].total_revenue || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching admin dashboard.' });
    }
};
