const mysql = require('mysql2/promise');

const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Pune', lat: 18.5167, lng: 73.8562 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Nashik', lat: 19.9525, lng: 73.8340 },
    { name: 'Thane', lat: 19.2183, lng: 72.9781 },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 }
];

const adjectives = ['Grand', 'Central', 'Metro', 'City', 'Prime', 'Express', 'Smart', 'Secure', 'Royal', 'Modern'];
const nouns = ['Mall', 'Plaza', 'Station', 'Market', 'Tower', 'Heights', 'Avenue', 'Park', 'Square', 'Center'];

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateLocation(id) {
    const city = randomElement(cities);
    const name = `${randomElement(adjectives)} ${randomElement(nouns)} Parking`;
    // slight random offset for coordinates (approx 1-5km radius)
    const lat = city.lat + (Math.random() - 0.5) * 0.05;
    const lng = city.lng + (Math.random() - 0.5) * 0.05;
    const price = Math.floor(Math.random() * 5 + 2) * 10; // 20 to 60

    return {
        id,
        operator_id: 4,
        name,
        address: `Near ${name}, ${city.name}`,
        city: city.name,
        latitude: lat,
        longitude: lng,
        description: 'A premium smart parking location with 24/7 security and automated booking systems.',
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800',
        opening_time: '00:00:00',
        closing_time: '23:59:59',
        status: 'ACTIVE',
        price
    };
}

async function seedMassive() {
    console.log('Connecting to TiDB...');
    const conn = await mysql.createConnection('mysql://2nhFaEBb2dB5R31.root:QaT4n05VnHB9Gg9v@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/smart_parking?ssl={"rejectUnauthorized":true}');
    
    let nextId = 5; // We already have 1, 2, 3, 4
    for (let i = 0; i < 30; i++) {
        const loc = generateLocation(nextId);
        
        await conn.query(`
            INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [loc.id, loc.operator_id, loc.name, loc.address, loc.city, loc.latitude, loc.longitude, loc.description, loc.image, loc.opening_time, loc.closing_time, loc.status]);

        // Insert 3 slots per location
        await conn.query(`
            INSERT IGNORE INTO parking_slots (parking_location_id, slot_number, type, price_per_hour, status) VALUES 
            (?, 'A1', 'CAR', ?, 'AVAILABLE'), 
            (?, 'A2', 'BIKE', ?, 'AVAILABLE'),
            (?, 'A3', 'EV', ?, 'AVAILABLE')
        `, [loc.id, loc.price, loc.id, loc.price / 2, loc.id, loc.price * 1.5]);

        nextId++;
    }

    console.log('30 more locations inserted successfully!');
    process.exit(0);
}
seedMassive().catch(console.error);
