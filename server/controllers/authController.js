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
