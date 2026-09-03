const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const userRole = role || 'DRIVER'; // Default role
        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, hashedPassword, userRole]
        );

        // Generate JWT
        const token = jwt.sign(
            { id: result.insertId, role: userRole },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        // Send Welcome Email via Brevo API
        try {
            if (process.env.BREVO_API_KEY && process.env.EMAIL_USER) {
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #eee; background-color: #f9f9f9;">
                        <h2 style="color: #2563eb; text-align: center;">Welcome to SmartPark, ${name}!</h2>
                        <p>We are thrilled to have you on board.</p>
                        <p>With SmartPark, you can easily find and book parking slots anywhere in the city instantly.</p>
                        <div style="background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 16px;"><strong>Ready to park?</strong></p>
                            <p style="color: #888; font-size: 14px;">Log in to the app and book your first slot!</p>
                        </div>
                        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                            Thank you for joining the SmartPark ecosystem.
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
                        to: [{ email: email }],
                        subject: "🎉 Welcome to SmartPark!",
                        htmlContent: htmlContent
                    })
                })
                .then(res => res.json())
                .then(data => console.log(`Welcome email sent via Brevo:`, data))
                .catch(err => console.error("Brevo welcome email failed:", err));
            }
        } catch (emailErr) {
            console.error("Email setup failed:", emailErr);
        }

        res.status(201).json({
            token,
            user: {
                id: result.insertId,
                name,
                email,
                role: userRole
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error in Registration.' });
    }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Check if user is active
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ message: 'Account is not active. Please contact support.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error in Login.' });
    }
};

// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error in fetching profile.' });
    }
};
