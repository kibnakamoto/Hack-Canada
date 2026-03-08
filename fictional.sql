


INSERT INTO businesses (
    auth0_user_id,
    company_name,
    registered_address,
    status,
    is_franchise,
    start_date,
    services_offered,
    cost_update_requested,
    platform_commission_percent
) VALUES (
    'auth0|69ac6ff7f25c2bcbc54cf8f9',  
    'Lakeshore Bread & Pastry',
    '124 Queen Street West, Toronto, ON M5V 1A8',
    'active',
    FALSE,
    '2019-03-15',
    '["bakery", "pastries", "bread", "coffee", "catering"]',
    FALSE,
    5.00   
);

INSERT INTO products (business_id, name, description, price, stock_quantity) VALUES
(1, 'Sourdough Loaf', 'House-made sourdough, 500g', 7.50, 24),
(1, 'Croissant', 'Butter croissant, baked daily', 4.25, 36),
(1, 'Chocolate Brownie', 'Dark chocolate brownie', 5.00, 18),
(1, 'Whole Wheat Loaf', 'Stone-ground whole wheat, 450g', 6.75, 20),
(1, 'Espresso', 'Single shot', 3.00, 100);





INSERT INTO businesses (
    auth0_user_id,
    company_name,
    registered_address,
    status,
    is_franchise,
    start_date,
    services_offered,
    cost_update_requested,
    platform_commission_percent
) VALUES (
    'auth0|fictional-hardware-002',  
    'Wellington Hardware & Garden',
    '312 Princess Street, Kingston, ON K7L 1B5',
    'active',
    FALSE,
    '2015-08-01',
    '["hardware", "garden supplies", "tools", "paint", "seeds"]',
    FALSE,
    5.00  
);

INSERT INTO products (business_id, name, description, price, stock_quantity) VALUES
(2, 'Bird Feeder', 'Wooden bird feeder, holds 2 lbs seed', 34.99, 12),
(2, 'Tomato Seeds', 'Heirloom tomato, packet of 25', 4.99, 48),
(2, 'Paint Brush Set', '4-piece bristle brush set', 18.50, 20),
(2, 'LED Bulb 60W', 'Soft white, 2-pack', 9.99, 36),
(2, 'Potting Soil 20L', 'All-purpose potting mix', 14.99, 24);
