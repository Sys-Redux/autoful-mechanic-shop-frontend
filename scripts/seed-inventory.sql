-- Seed Inventory Parts for Autoful
-- Run this directly in your PostgreSQL database

INSERT INTO inventory (part_name, price, quantity_in_stock) VALUES
-- Engine Components
('Oil Filter - Standard', 8.99, 50),
('Oil Filter - Premium Synthetic', 14.99, 30),
('Air Filter - Standard', 19.99, 40),
('Air Filter - High Performance K&N', 54.99, 15),
('Spark Plug - Copper (each)', 3.99, 100),
('Spark Plug - Iridium (each)', 12.99, 60),
('Spark Plug - Platinum (each)', 8.99, 80),
('Ignition Coil', 45.99, 20),
('Serpentine Belt', 32.99, 25),
('Timing Belt Kit', 189.99, 8),
('Water Pump', 75.99, 12),
('Thermostat', 18.99, 35),
('Radiator Hose - Upper', 24.99, 20),
('Radiator Hose - Lower', 22.99, 20),
('Coolant/Antifreeze (1 Gallon)', 16.99, 40),
('Fuel Filter', 15.99, 30),
('PCV Valve', 9.99, 25),

-- Oils & Fluids
('Motor Oil 5W-30 Conventional (5qt)', 24.99, 60),
('Motor Oil 5W-30 Full Synthetic (5qt)', 42.99, 45),
('Motor Oil 0W-20 Full Synthetic (5qt)', 44.99, 40),
('Motor Oil 5W-40 Diesel (1 Gallon)', 32.99, 20),
('Transmission Fluid ATF (1qt)', 8.99, 50),
('Brake Fluid DOT 3 (12oz)', 6.99, 40),
('Brake Fluid DOT 4 (12oz)', 9.99, 30),
('Power Steering Fluid (12oz)', 7.99, 35),
('Differential Fluid 75W-90 (1qt)', 14.99, 20),

-- Brakes
('Brake Pads - Front Ceramic', 49.99, 24),
('Brake Pads - Rear Ceramic', 44.99, 24),
('Brake Pads - Front Semi-Metallic', 34.99, 20),
('Brake Pads - Rear Semi-Metallic', 29.99, 20),
('Brake Rotor - Front (each)', 65.99, 16),
('Brake Rotor - Rear (each)', 55.99, 16),
('Brake Rotor - Drilled & Slotted Front', 89.99, 8),
('Brake Caliper - Remanufactured', 79.99, 10),
('Brake Line - Stainless Steel', 24.99, 12),
('Brake Hardware Kit', 12.99, 30),

-- Suspension & Steering
('Strut Assembly - Front (each)', 149.99, 8),
('Shock Absorber - Rear (each)', 59.99, 12),
('Control Arm - Lower Front', 89.99, 10),
('Ball Joint - Lower', 34.99, 16),
('Tie Rod End - Inner', 29.99, 20),
('Tie Rod End - Outer', 24.99, 20),
('Sway Bar Link', 22.99, 24),
('Wheel Bearing Hub Assembly - Front', 129.99, 8),
('CV Axle - Front (each)', 89.99, 10),
('Strut Mount', 39.99, 12),

-- Electrical
('Car Battery - Standard 600 CCA', 129.99, 15),
('Car Battery - Premium AGM 800 CCA', 219.99, 8),
('Alternator - Remanufactured', 189.99, 6),
('Starter Motor - Remanufactured', 159.99, 6),
('Headlight Bulb - Halogen H11', 14.99, 30),
('Headlight Bulb - LED H11', 39.99, 20),
('Tail Light Bulb 3157', 4.99, 50),
('Fuse Assortment Pack', 9.99, 25),
('Battery Terminal Cleaner', 5.99, 20),
('Battery Cables - Pair', 29.99, 15),

-- Exhaust
('Oxygen Sensor - Upstream', 54.99, 15),
('Oxygen Sensor - Downstream', 44.99, 15),
('Catalytic Converter - Universal', 189.99, 5),
('Muffler - Universal', 79.99, 8),
('Exhaust Clamp 2.5"', 6.99, 30),
('Exhaust Gasket', 8.99, 25),

-- Wipers & Visibility
('Wiper Blade 22" - Standard', 12.99, 30),
('Wiper Blade 22" - Beam Style', 24.99, 20),
('Wiper Blade 18" - Standard', 10.99, 30),
('Windshield Washer Fluid (1 Gallon)', 4.99, 50),
('Rain-X Washer Fluid (1 Gallon)', 7.99, 25),

-- Tires & Wheels
('Tire Pressure Sensor (TPMS)', 34.99, 20),
('Valve Stem - Standard', 2.99, 100),
('Valve Stem - TPMS Compatible', 8.99, 40),
('Lug Nut - Standard (each)', 1.99, 200),
('Wheel Lock Set', 29.99, 15),
('Tire Patch Kit', 12.99, 20),

-- HVAC
('Cabin Air Filter - Standard', 18.99, 35),
('Cabin Air Filter - Charcoal', 24.99, 25),
('A/C Refrigerant R134a (12oz)', 9.99, 40),
('A/C Compressor - Remanufactured', 289.99, 4),
('Blower Motor', 69.99, 8),
('Blower Motor Resistor', 24.99, 12),

-- Gaskets & Seals
('Valve Cover Gasket Set', 29.99, 15),
('Oil Pan Gasket', 22.99, 12),
('Head Gasket Set', 149.99, 5),
('Intake Manifold Gasket Set', 34.99, 10),
('Exhaust Manifold Gasket', 19.99, 15),
('Rear Main Seal', 24.99, 10),
('Front Crankshaft Seal', 12.99, 15),

-- Miscellaneous
('Engine Mount', 54.99, 10),
('Transmission Mount', 44.99, 10),
('Fuel Cap', 14.99, 20),
('Hood Strut (each)', 24.99, 16),
('Door Handle - Exterior', 34.99, 12),
('Side Mirror - Manual', 44.99, 8),
('Side Mirror - Power', 79.99, 6),
('Radiator Cap', 9.99, 25),
('Coolant Reservoir', 29.99, 10),
('Windshield Washer Pump', 19.99, 15);

-- Verify the insert
SELECT COUNT(*) as total_parts FROM inventory;
