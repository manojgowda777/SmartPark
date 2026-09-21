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
        const startTimeStr = `${startHour.toString().padStart(2, '0')}:00:00`;
        const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;

        // DOUBLE BOOKING PROTECTION: Strictly check for overlapping confirmed bookings before inserting
        const overlapQuery = `
            SELECT id FROM bookings 
            WHERE parking_location_id = ? 
            AND slot_id = ?
            AND booking_date = ? 
            AND booking_status = 'CONFIRMED'
            AND start_time < ? 
            AND end_time > ?
        `;
        const [overlapping] = await db.query(overlapQuery, [parking_location_id, slot_id, date, end_time, startTimeStr]);
        
        if (overlapping.length > 0) {
            return res.status(409).json({ message: 'This slot was just booked by another user for this exact time. Please select another slot.' });
        }

        // 3. Create the booking record
        const [bookingResult] = await db.query(
            `INSERT INTO bookings 
            (user_id, vehicle_id, parking_location_id, slot_id, booking_date, start_time, end_time, duration, amount, payment_status, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING')`,
            [user_id, vehicle_id, parking_location_id, slot_id, date, startTimeStr, end_time, duration, amount]
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
        
        // We do NOT permanently lock the slot_status to 'BOOKED' anymore, because availability is strictly dynamic!
        // But for fallback/legacy logic, we can leave the base status alone or set it. Better to leave it alone so it can be dynamically calculated.
        
        // REAL-TIME UPDATE: Notify all connected clients that a booking was made at this location!
        const io = req.app.get('io');
        if (io) {
            io.emit('booking_updated', { parking_location_id });
        }

        // 6. Send Email Confirmation via HTTP (Brevo API to bypass Render Firewall and send to anyone)
        try {
            if (process.env.BREVO_API_KEY && process.env.EMAIL_USER) {
                // Get user email
                const [users] = await db.query('SELECT email, name FROM users WHERE id = ?', [user_id]);
                const userEmail = users[0].email;
                const userName = users[0].name;

                // Get parking location name for the email
                const [locations] = await db.query('SELECT name FROM parking_locations WHERE id = ?', [parking_location_id]);
                const locationName = locations[0].name;
                
                const htmlContent = `
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
                `;

                fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'api-key': process.env.BREVO_API_KEY
                    },
                    body: JSON.stringify({
                        sender: { name: "SmartPark", email: process.env.EMAIL_USER },
                        to: [{ email: userEmail }],
                        subject: `🚗 Booking Confirmed - ${locationName}`,
                        htmlContent: htmlContent
                    })
                })
                .then(res => res.json())
                .then(data => console.log(`Confirmation email sent via Brevo API:`, data))
                .catch(emailError => console.error("Failed to send email confirmation via Brevo:", emailError));
                
            } else {
                console.log('Skipped sending email because BREVO_API_KEY is missing.');
            }
        } catch (emailError) {
            console.error("Failed to setup email confirmation:", emailError);
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

exports.testEmail = async (req, res) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.json({ status: 'error', message: 'EMAIL_USER or EMAIL_PASS environment variables are completely missing in Render.' });
        }
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.verify();
        res.json({ status: 'success', message: 'SMTP connection verified successfully! Email credentials are correct.' });
    } catch (error) {
        res.json({ status: 'error', message: error.message, fullError: error });
    }
};


exports.testResend = async (req, res) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            return res.json({ status: 'error', message: 'RESEND_API_KEY is missing in Render environment variables.' });
        }
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Use a test email provided in the query string or default to a dummy string (which will cause a readable error)
        const toEmail = req.query.email || 'test@example.com';

        const data = await resend.emails.send({
            from: 'SmartPark <onboarding@resend.dev>',
            to: toEmail,
            subject: 'Test Resend API',
            html: '<p>This is a test from SmartPark API</p>'
        });

        res.json({ status: 'success', data });
    } catch (error) {
        res.json({ status: 'error', message: error.message, fullError: error });
    }
};

const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { parking_location_id, slot_id, date, start_time, duration } = req.body;
        
        if (!parking_location_id || !slot_id || !date || !start_time || !duration) {
            return res.status(400).json({ message: 'Missing booking details.' });
        }

        const startHour = parseInt(start_time.split(':')[0]);
        const endHour = (startHour + parseInt(duration)) % 24;
        const startTimeStr = ${startHour.toString().padStart(2, '0')}:00:00;
        const end_time = ${endHour.toString().padStart(2, '0')}:00:00;

        const overlapQuery = \
            SELECT id FROM bookings 
            WHERE parking_location_id = ? 
            AND slot_id = ?
            AND booking_date = ? 
            AND booking_status = 'CONFIRMED'
            AND start_time < ? 
            AND end_time > ?
        \;
        const [overlapping] = await db.query(overlapQuery, [parking_location_id, slot_id, date, end_time, startTimeStr]);
        
        if (overlapping.length > 0) {
            return res.status(409).json({ message: 'This slot was just booked by another user for this exact time. Please select another slot.' });
        }

        const amount = parseInt(duration) * 40;

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: \eceipt_order_\\
        };

        const order = await instance.orders.create(options);
        
        res.json({
            order_id: order.id,
            amount: amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
};

exports.verifyPaymentAndBook = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;
        const user_id = req.user.id;
        const { vehicle_number, parking_location_id, slot_id, date, start_time, duration } = bookingData;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
        }

        const startHour = parseInt(start_time.split(':')[0]);
        const endHour = (startHour + parseInt(duration)) % 24;
        const startTimeStr = ${startHour.toString().padStart(2, '0')}:00:00;
        const end_time = ${endHour.toString().padStart(2, '0')}:00:00;

        const overlapQuery = \
            SELECT id FROM bookings 
            WHERE parking_location_id = ? 
            AND slot_id = ?
            AND booking_date = ? 
            AND booking_status = 'CONFIRMED'
            AND start_time < ? 
            AND end_time > ?
        \;
        const [overlapping] = await db.query(overlapQuery, [parking_location_id, slot_id, date, end_time, startTimeStr]);
        
        if (overlapping.length > 0) {
            return res.status(409).json({ message: 'This slot was booked by someone else while you were paying. Please contact support for a refund.' });
        }

        const amount = parseInt(duration) * 40;
        let vehicle_id;
        const [existingVehicles] = await db.query('SELECT id FROM vehicles WHERE user_id = ? AND vehicle_number = ?', [user_id, vehicle_number]);
        if (existingVehicles.length > 0) {
            vehicle_id = existingVehicles[0].id;
        } else {
            const [newVehicle] = await db.query(
                'INSERT INTO vehicles (user_id, vehicle_number, vehicle_type) VALUES (?, ?, ?)',
                [user_id, vehicle_number, 'CAR']
            );
            vehicle_id = newVehicle.insertId;
        }

        const [bookingResult] = await db.query(
            \INSERT INTO bookings 
            (user_id, vehicle_id, parking_location_id, slot_id, booking_date, start_time, end_time, duration, amount, payment_status, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAID', 'CONFIRMED')\,
            [user_id, vehicle_id, parking_location_id, slot_id, date, startTimeStr, end_time, duration, amount]
        );
        
        const booking_id = bookingResult.insertId;

        await db.query(
            \INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, payment_status, paid_at) 
            VALUES (?, ?, ?, 'RAZORPAY', ?, 'SUCCESS', NOW())\,
            [booking_id, user_id, amount, razorpay_payment_id]
        );

        const io = req.app.get('io');
        if (io) {
            io.emit('booking_updated', { parking_location_id });
        }

        res.status(200).json({ message: 'Payment verified and booking confirmed successfully!' });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: 'Server Error verifying payment.', error: error.message });
    }
};
