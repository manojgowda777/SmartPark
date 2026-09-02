USE smart_parking;

-- Pune Locations
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (3, 2, 'Phoenix Marketcity Parking', 'Viman Nagar', 'Pune', 18.5626, 73.9168, 'Secure mall parking with EV charging stations.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '08:00:00', '23:30:00');

INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (4, 2, 'Ruby Hall Clinic Parking', 'Bund Garden Road', 'Pune', 18.5360, 73.8777, 'Hospital parking for patients and visitors.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '00:00:00', '23:59:59');

-- Nagpur Location
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (5, 2, 'Empress Mall Parking', 'Gandhi Sagar Lake', 'Nagpur', 21.1458, 79.0882, 'Multi-level car parking near the mall.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '09:00:00', '22:30:00');

-- Nashik Location
INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (6, 2, 'City Centre Mall Parking', 'Untwadi Road', 'Nashik', 19.9868, 73.7667, 'Spacious parking lot in Nashik.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '10:00:00', '22:00:00');

-- Insert Slots for these new locations
INSERT IGNORE INTO parking_slots (parking_location_id, slot_number, slot_type, price_per_hour, status) VALUES 
(3, 'A01', 'CAR', 30.00, 'AVAILABLE'),
(3, 'A02', 'CAR', 30.00, 'AVAILABLE'),
(4, 'M01', 'BIKE', 15.00, 'AVAILABLE'),
(4, 'M02', 'BIKE', 15.00, 'AVAILABLE'),
(4, 'C01', 'CAR', 40.00, 'AVAILABLE'),
(5, 'L1-01', 'CAR', 20.00, 'AVAILABLE'),
(6, 'B1', 'CAR', 25.00, 'AVAILABLE');
