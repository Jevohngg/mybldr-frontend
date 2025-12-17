/*
  # Simple Grid-Based Lot Layout

  1. Changes
    - Replace complex organic shapes with simple, uniform lots
    - Regular rectangular and slightly trapezoidal shapes
    - Arranged in a clean grid pattern within the boundary
    - All lots fit neatly inside the community square

  2. Layout Design
    - 4 rows of lots in a grid pattern
    - Row 1 (top): 801-807 (7 lots)
    - Row 2: 808-814 (7 lots)
    - Row 3: 815-821 (7 lots)
    - Row 4 (bottom): 822-826 (5 lots)
    - Total: 26 lots

  3. Status Assignments
    - Available (blue): 805, 806, 809, 810, 815, 818, 819, 822, 825
    - Reserved (gray): 801, 803, 807, 808, 811, 812, 813, 814, 816, 817, 820, 821, 823, 824, 826
    - QA (red): 802
    - Move-in Ready stars: 804, 808, 815, 820
*/

-- Clear existing lots
DELETE FROM lots WHERE community_id = 'silver-lake';

-- ROW 1 (TOP) - 7 lots
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

('801', 'silver-lake', 'reserved', false,
 '{"points": "420,220 500,220 500,300 420,300"}', 'polygon'),

('802', 'silver-lake', 'qa', false,
 '{"points": "520,220 600,220 600,300 520,300"}', 'polygon'),

('803', 'silver-lake', 'reserved', false,
 '{"points": "620,220 700,220 700,300 620,300"}', 'polygon'),

('804', 'silver-lake', 'reserved', true,
 '{"points": "720,220 800,220 800,300 720,300"}', 'polygon'),

('805', 'silver-lake', 'available', false,
 '{"points": "820,220 900,220 900,300 820,300"}', 'polygon'),

('806', 'silver-lake', 'available', false,
 '{"points": "920,220 1000,220 1000,300 920,300"}', 'polygon'),

('807', 'silver-lake', 'reserved', false,
 '{"points": "1020,220 1100,220 1100,300 1020,300"}', 'polygon');

-- ROW 2 - 7 lots
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

('808', 'silver-lake', 'reserved', true,
 '{"points": "420,320 500,320 500,400 420,400"}', 'polygon'),

('809', 'silver-lake', 'available', false,
 '{"points": "520,320 600,320 600,400 520,400"}', 'polygon'),

('810', 'silver-lake', 'available', false,
 '{"points": "620,320 700,320 700,400 620,400"}', 'polygon'),

('811', 'silver-lake', 'reserved', false,
 '{"points": "720,320 800,320 800,400 720,400"}', 'polygon'),

('812', 'silver-lake', 'reserved', false,
 '{"points": "820,320 900,320 900,400 820,400"}', 'polygon'),

('813', 'silver-lake', 'reserved', false,
 '{"points": "920,320 1000,320 1000,400 920,400"}', 'polygon'),

('814', 'silver-lake', 'reserved', false,
 '{"points": "1020,320 1100,320 1100,400 1020,400"}', 'polygon');

-- ROW 3 - 7 lots
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

('815', 'silver-lake', 'available', true,
 '{"points": "420,420 500,420 500,500 420,500"}', 'polygon'),

('816', 'silver-lake', 'reserved', false,
 '{"points": "520,420 600,420 600,500 520,500"}', 'polygon'),

('817', 'silver-lake', 'reserved', false,
 '{"points": "620,420 700,420 700,500 620,500"}', 'polygon'),

('818', 'silver-lake', 'available', false,
 '{"points": "720,420 800,420 800,500 720,500"}', 'polygon'),

('819', 'silver-lake', 'available', false,
 '{"points": "820,420 900,420 900,500 820,500"}', 'polygon'),

('820', 'silver-lake', 'reserved', true,
 '{"points": "920,420 1000,420 1000,500 920,500"}', 'polygon'),

('821', 'silver-lake', 'reserved', false,
 '{"points": "1020,420 1100,420 1100,500 1020,500"}', 'polygon');

-- ROW 4 (BOTTOM) - 5 lots
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

('822', 'silver-lake', 'available', false,
 '{"points": "520,520 620,520 620,600 520,600"}', 'polygon'),

('823', 'silver-lake', 'reserved', false,
 '{"points": "640,520 740,520 740,600 640,600"}', 'polygon'),

('824', 'silver-lake', 'reserved', false,
 '{"points": "760,520 860,520 860,600 760,600"}', 'polygon'),

('825', 'silver-lake', 'available', false,
 '{"points": "880,520 980,520 980,600 880,600"}', 'polygon'),

('826', 'silver-lake', 'reserved', false,
 '{"points": "1000,520 1100,520 1100,600 1000,600"}', 'polygon');
