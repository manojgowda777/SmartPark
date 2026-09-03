const db = require('../config/db');

// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    const { parking_location_id, slot_id, vehicle_number, date, start_time, duration, amount } = req.body;
    const user_id = req.user.id;

    try {
        // Simple validation
        if (!slot_id || !vehicle_number || !date || !start_time || !duration || !amount) {
            return res.status(400).json({ message: 'Please provide all booking details.' });
        }

        // 1. Ensure a vehicle exists or create one quickly for this MVP
        let vehicle_id;
        const [existingVehicles] = await db.query('SELECT id FROM vehicles WHERE vehicle_number = ? AND user_id = ?', [vehicle_number, user_id]);
        
        if (existingVehicles.length > 0) {
            vehicle_id = existingVehicles[0].id;
        } else {
            const [newVehicle] = await db.query(
                'INSERT INTO vehicles (user_id, vehicle_number, vehicle_type) VALUES (?, ?, ?)',
                [user_id, vehicle_number, 'CAR']
            );
            vehicle_id = newVehicle.insertId;
        }

        // 2. Calculate end time based on start_time and duration (simple hours addition)
        const startHour = parseInt(start_time.split(':')[0]);
        const endHour = (startHour + parseInt(duration)) % 24;
        const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;

        // 3. Create the booking record
        const [bookingResult] = await db.query(
            `INSERT INTO bookings 
            (user_id, vehicle_id, parking_location_id, slot_id, booking_date, start_time, end_time, duration, amount, payment_status, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING')`,
            [user_id, vehicle_id, parking_location_id, slot_id, date, start_time, end_time, duration, amount]
        );
        
        const booking_id = bookingResult.insertId;

        // 4. Simulate a successful payment
        await db.query(
            `INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, payment_status, paid_at) 
            VALUES (?, ?, ?, 'TEST_CARD', 'TXN123456789', 'SUCCESS', NOW())`,
            [booking_id, user_id, amount]
        );

        // 5. Update booking and slot status
        await db.query(`UPDATE bookings SET payment_status = 'PAID', booking_status = 'CONFIRMED' WHERE id = ?`, [booking_id]);
        await db.query(`UPDATE parking_slots SET status = 'BOOKED' WHERE id = ?`, [slot_id]);

        // 6. Send Email Confirmation via Nodemailer
        try {
            const nodemailer = require('nodemailer');
            
            // Get user email
            const [users] = await db.query('SELECT email, name FROM users WHERE id = ?', [user_id]);
            const userEmail = users[0].email;
            const userName = users[0].name;

            // Get parking location name for the email
            const [locations] = await db.query('SELECT name FROM parking_locations WHERE id = ?', [parking_location_id]);
            const locationName = locations[0].name;

            // Only attempt to send if email credentials exist
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: `"SmartPark System" <${process.env.EMAIL_USER}>`,
                    to: userEmail,
                    subject: `🚗 Booking Confirmed - ${locationName}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #eee; background-color: #f9f9f9;">
                            <h2 style="color: #2563eb; text-align: center;">SmartPark Booking Confirmed!</h2>
                            <p>Hi <strong>${userName}</strong>,</p>
                            <p>Your parking slot has been successfully booked. Here are your details:</p>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
                                <p><strong>📍 Location:</strong> ${locationName}</p>
                                <p><strong>📅 Date:</strong> ${date}</p>
                                <p><strong>⏰ Time:</strong> ${start_time} (for ${duration} hours)</p>
                                <p><strong>🚘 Vehicle:</strong> ${vehicle_number}</p>
                                <p><strong>💵 Amount Paid:</strong> ₹${amount}</p>
                            </div>

                            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                                Thank you for using SmartPark! Show this email to the operator if requested.
                            </p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`Confirmation email sent to ${userEmail}`);
            } else {
                console.log('Skipped sending email because EMAIL_USER or EMAIL_PASS environment variables are missing.');
            }
        } catch (emailError) {
            console.error("Failed to send email confirmation:", emailError);
            // We do not fail the booking if email fails!
        }

        res.status(201).json({
            message: 'Booking confirmed successfully!',
            booking_id
        });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: 'Server Error processing booking.' });
    }
};

// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const user_id = req.user.id;

    try {
        // Find the booking
        const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [bookingId, user_id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        
        const booking = bookings[0];
        
        if (booking.booking_status !== 'CONFIRMED') {
            return res.status(400).json({ message: 'Only confirmed bookings can be cancelled.' });
        }

        // Update booking status
        await db.query(`UPDATE bookings SET booking_status = 'CANCELLED' WHERE id = ?`, [bookingId]);
        
        // Free up the slot
        await db.query(`UPDATE parking_slots SET status = 'AVAILABLE' WHERE id = ?`, [booking.slot_id]);

        res.json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        console.error("Cancellation error:", error);
        res.status(500).json({ message: 'Server Error cancelling booking.' });
    }
};
