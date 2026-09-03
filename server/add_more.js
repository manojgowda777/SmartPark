const mysql = require('mysql2/promise');

async function seedMore() {
    const conn = await mysql.createConnection('mysql://2nhFaEBb2dB5R31.root:QaT4n05VnHB9Gg9v@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/smart_parking?ssl={"rejectUnauthorized":true}');
    
    await conn.query(`
        INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time, status) VALUES 
        (2, 4, 'Pune Central Mall Parking', 'Deccan Gymkhana', 'Pune', 18.5167, 73.8562, 'Spacious parking near the mall.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '08:00:00', '22:00:00', 'ACTIVE'),
        (3, 4, 'Nagpur Metro Parking', 'Sitabuldi', 'Nagpur', 21.1458, 79.0882, 'Convenient metro station parking.', 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?auto=format&fit=crop&q=80&w=800', '05:00:00', '23:30:00', 'ACTIVE'),
        (4, 4, 'Nashik Road Station Parking', 'Nashik Road', 'Nashik', 19.9525, 73.8340, 'Safe and secure parking near the station.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', '00:00:00', '23:59:59', 'ACTIVE')
    `);

    await conn.query(`
        INSERT IGNORE INTO parking_slots (parking_location_id, slot_number, type, price_per_hour, status) VALUES 
        (2, 'P1', 'CAR', 30.00, 'AVAILABLE'), (2, 'P2', 'BIKE', 15.00, 'AVAILABLE'),
        (3, 'N1', 'CAR', 25.00, 'AVAILABLE'), (3, 'N2', 'EV', 50.00, 'AVAILABLE'),
        (4, 'S1', 'CAR', 20.00, 'AVAILABLE'), (4, 'S2', 'BIKE', 10.00, 'AVAILABLE')
    `);

    console.log('More locations added!');
    process.exit(0);
}
seedMore().catch(console.error);
