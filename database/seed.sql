USE smart_parking;

INSERT IGNORE INTO users (id, name, email, phone, password, role) VALUES (1, 'Admin', 'admin@smartpark.com', '1234567890', 'mockpassword', 'ADMIN');
INSERT IGNORE INTO users (id, name, email, phone, password, role) VALUES (2, 'City Operator', 'operator@smartpark.com', '1234567890', 'mockpassword', 'OPERATOR');

INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (1, 2, 'City Center Parking', '123 Main St, Near Mall', 'Mumbai', 19.0760, 72.8777, 'Premium covered parking in the heart of the city.', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800', '06:00:00', '23:00:00');

INSERT IGNORE INTO parking_locations (id, operator_id, name, address, city, latitude, longitude, description, image, opening_time, closing_time) 
VALUES (2, 2, 'Airport Connect Parking', 'Terminal 2 Road', 'Mumbai', 19.0960, 72.8877, 'Secure long-term parking near the airport.', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800', '00:00:00', '23:59:59');

INSERT IGNORE INTO parking_slots (parking_location_id, slot_number, slot_type, price_per_hour, status) VALUES 
(1, 'A01', 'CAR', 40.00, 'AVAILABLE'),
(1, 'A02', 'CAR', 40.00, 'BOOKED'),
(1, 'A03', 'CAR', 40.00, 'AVAILABLE'),
(1, 'B01', 'CAR', 40.00, 'AVAILABLE'),
(1, 'B02', 'CAR', 40.00, 'OCCUPIED'),
(1, 'B03', 'CAR', 40.00, 'MAINTENANCE'),
(1, 'M01', 'BIKE', 20.00, 'AVAILABLE'),
(1, 'M02', 'BIKE', 20.00, 'AVAILABLE'),
(2, 'P01', 'CAR', 50.00, 'AVAILABLE'),
(2, 'P02', 'CAR', 50.00, 'AVAILABLE');
