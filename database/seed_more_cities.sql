USE smart_parking;

-- Mumbai Locations
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(7, 4, 'Palladium Mall Parking', 'Lower Parel', 'Mumbai', 18.9940, 72.8258, 'Premium valet and self-parking at Palladium.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '10:00:00', '23:30:00'),
(8, 4, 'Bandra Kurla Complex (BKC) Public Parking', 'BKC, Bandra East', 'Mumbai', 19.0654, 72.8654, 'Large public parking lot for office goers.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '07:00:00', '22:00:00');

-- Pune Locations
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(9, 4, 'Pune Railway Station Multi-level', 'Agarkar Nagar', 'Pune', 18.5284, 73.8739, '24/7 parking near Pune Junction.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '00:00:00', '23:59:59'),
(10, 4, 'Amanora Mall Parking', 'Hadapsar', 'Pune', 18.5197, 73.9391, 'Spacious basement parking.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '10:00:00', '23:00:00');

-- Thane Locations
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(11, 4, 'Viviana Mall Parking', 'Eastern Express Highway', 'Thane', 19.2084, 72.9734, 'Huge parking capacity for Thane residents.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '11:00:00', '23:30:00'),
(12, 4, 'Thane Station West Parking', 'Naupada', 'Thane', 19.1856, 72.9774, 'Pay and park facility near station.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '06:00:00', '23:59:59');

-- Navi Mumbai
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(13, 4, 'Inorbit Mall Parking', 'Vashi', 'Navi Mumbai', 19.0740, 72.9984, 'Safe and secure parking in Vashi.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '10:00:00', '22:30:00');

-- Chhatrapati Sambhajinagar
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(14, 4, 'Prozone Mall Parking', 'API Corner, MIDC', 'Chhatrapati Sambhajinagar', 19.8824, 75.3524, 'Largest parking lot in the city.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '10:30:00', '22:30:00');

-- Kolhapur
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(15, 4, 'Mahalakshmi Temple Parking', 'Shivaji Peth', 'Kolhapur', 16.6946, 74.2230, 'Tourist parking facility.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '05:00:00', '22:00:00');

-- Solapur
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) VALUES 
(16, 4, 'Oasis Mall Parking', 'Bale', 'Solapur', 17.6894, 75.9037, 'Mall parking with security.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '10:00:00', '22:00:00');

-- Insert Slots for these new locations
INSERT IGNORE INTO parking_slots (parking_location_id, slot_number, slot_type, price_per_hour, status) VALUES 
(7, 'P-01', 'CAR', 60.00, 'AVAILABLE'), (7, 'P-02', 'CAR', 60.00, 'AVAILABLE'), (7, 'P-B1', 'BIKE', 20.00, 'AVAILABLE'),
(8, 'BKC-01', 'CAR', 40.00, 'AVAILABLE'), (8, 'BKC-02', 'CAR', 40.00, 'AVAILABLE'), (8, 'BKC-03', 'CAR', 40.00, 'AVAILABLE'),
(9, 'ST-1', 'CAR', 30.00, 'AVAILABLE'), (9, 'ST-2', 'BIKE', 15.00, 'AVAILABLE'),
(10, 'AM-A1', 'CAR', 40.00, 'AVAILABLE'), (10, 'AM-A2', 'CAR', 40.00, 'AVAILABLE'), (10, 'AM-B1', 'BIKE', 15.00, 'AVAILABLE'),
(11, 'VIV-1', 'CAR', 50.00, 'AVAILABLE'), (11, 'VIV-2', 'CAR', 50.00, 'AVAILABLE'),
(12, 'TH-W1', 'CAR', 30.00, 'AVAILABLE'), (12, 'TH-W2', 'BIKE', 10.00, 'AVAILABLE'), (12, 'TH-W3', 'BIKE', 10.00, 'AVAILABLE'),
(13, 'IN-01', 'CAR', 40.00, 'AVAILABLE'), (13, 'IN-02', 'CAR', 40.00, 'AVAILABLE'),
(14, 'PRO-1', 'CAR', 30.00, 'AVAILABLE'), (14, 'PRO-2', 'CAR', 30.00, 'AVAILABLE'),
(15, 'TEM-1', 'CAR', 20.00, 'AVAILABLE'), (15, 'TEM-2', 'CAR', 20.00, 'AVAILABLE'), (15, 'TEM-B1', 'BIKE', 10.00, 'AVAILABLE'),
(16, 'OA-1', 'CAR', 25.00, 'AVAILABLE'), (16, 'OA-2', 'BIKE', 10.00, 'AVAILABLE');
