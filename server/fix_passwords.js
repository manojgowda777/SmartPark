const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPasswords() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'smart_parking'
    });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('mockpassword', salt);
        
        await pool.query('UPDATE users SET password = ? WHERE email IN ("admin@smartpark.com", "operator@smartpark.com")', [hashedPassword]);
        
        console.log('Passwords updated successfully.');
    } catch (error) {
        console.error(error);
    } finally {
        pool.end();
    }
}

fixPasswords();
