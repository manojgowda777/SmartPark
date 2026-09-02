const mysql = require('mysql2/promise');
require('dotenv').config();

// Use DATABASE_URL if available (for cloud deployment), otherwise fallback to local credentials
const pool = mysql.createPool(process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'smart_parking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
