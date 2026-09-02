const mysql = require('mysql2/promise');

async function fix() {
    const conn = await mysql.createConnection('mysql://2nhFaEBb2dB5R31.root:QaT4n05VnHB9Gg9v@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/smart_parking?ssl={"rejectUnauthorized":true}');
    
    await conn.query(`ALTER TABLE users ADD COLUMN status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE'`);
    await conn.query(`UPDATE users SET status = 'ACTIVE'`);
    console.log('Status column added and set to ACTIVE!');
    process.exit(0);
}
fix().catch(console.error);
