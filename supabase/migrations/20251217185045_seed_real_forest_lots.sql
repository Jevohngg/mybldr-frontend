/*
  # Seed Real Forest Community with Lots

  1. Changes
    - Adds lots for the 'real-forest' community
    - Creates a grid-based layout with 40 lots
    - Lots are arranged in a structured pattern with varied shapes
    - Includes different lot statuses (available, reserved, sold)
    - Each lot has position and shape data for interactive map rendering

  2. Details
    - Lot numbers: 101-140
    - Mix of rectangular lots
    - Realistic lot sizes (6000-9000 sqft)
    - Price range: $450k-$650k
    - Various lot statuses to show community activity
*/

-- Insert lots for Real Forest community
INSERT INTO lots (community_id, lot_number, status, move_in_ready, sqft, price, position, shape_type)
VALUES
  -- Row 1
  ('real-forest', '101', 'available', false, 7200, 525000, '{"x": 50, "y": 50, "width": 90, "height": 80}', 'polygon'),
  ('real-forest', '102', 'available', false, 6800, 495000, '{"x": 150, "y": 50, "width": 85, "height": 80}', 'polygon'),
  ('real-forest', '103', 'reserved', false, 7500, 545000, '{"x": 245, "y": 50, "width": 95, "height": 80}', 'polygon'),
  ('real-forest', '104', 'available', false, 7000, 515000, '{"x": 350, "y": 50, "width": 88, "height": 80}', 'polygon'),
  ('real-forest', '105', 'sold', false, 7300, 535000, '{"x": 448, "y": 50, "width": 92, "height": 80}', 'polygon'),
  ('real-forest', '106', 'available', false, 6900, 505000, '{"x": 550, "y": 50, "width": 86, "height": 80}', 'polygon'),
  ('real-forest', '107', 'available', false, 7100, 520000, '{"x": 646, "y": 50, "width": 89, "height": 80}', 'polygon'),
  ('real-forest', '108', 'reserved', false, 7400, 540000, '{"x": 745, "y": 50, "width": 93, "height": 80}', 'polygon'),

  -- Row 2
  ('real-forest', '109', 'available', false, 6700, 490000, '{"x": 50, "y": 140, "width": 84, "height": 85}', 'polygon'),
  ('real-forest', '110', 'sold', false, 7600, 555000, '{"x": 144, "y": 140, "width": 96, "height": 85}', 'polygon'),
  ('real-forest', '111', 'available', false, 7200, 525000, '{"x": 250, "y": 140, "width": 90, "height": 85}', 'polygon'),
  ('real-forest', '112', 'available', false, 6800, 495000, '{"x": 350, "y": 140, "width": 85, "height": 85}', 'polygon'),
  ('real-forest', '113', 'available', false, 7500, 545000, '{"x": 445, "y": 140, "width": 94, "height": 85}', 'polygon'),
  ('real-forest', '114', 'sold', false, 7000, 515000, '{"x": 549, "y": 140, "width": 88, "height": 85}', 'polygon'),
  ('real-forest', '115', 'available', false, 7300, 535000, '{"x": 647, "y": 140, "width": 91, "height": 85}', 'polygon'),
  ('real-forest', '116', 'reserved', false, 6900, 505000, '{"x": 748, "y": 140, "width": 87, "height": 85}', 'polygon'),

  -- Row 3
  ('real-forest', '117', 'available', false, 7100, 520000, '{"x": 50, "y": 235, "width": 89, "height": 82}', 'polygon'),
  ('real-forest', '118', 'available', false, 7400, 540000, '{"x": 149, "y": 235, "width": 93, "height": 82}', 'polygon'),
  ('real-forest', '119', 'sold', false, 6700, 490000, '{"x": 252, "y": 235, "width": 84, "height": 82}', 'polygon'),
  ('real-forest', '120', 'available', false, 7600, 555000, '{"x": 346, "y": 235, "width": 95, "height": 82}', 'polygon'),
  ('real-forest', '121', 'available', false, 7200, 525000, '{"x": 451, "y": 235, "width": 90, "height": 82}', 'polygon'),
  ('real-forest', '122', 'reserved', false, 6800, 495000, '{"x": 551, "y": 235, "width": 85, "height": 82}', 'polygon'),
  ('real-forest', '123', 'available', false, 7500, 545000, '{"x": 646, "y": 235, "width": 94, "height": 82}', 'polygon'),
  ('real-forest', '124', 'available', false, 7000, 515000, '{"x": 750, "y": 235, "width": 88, "height": 82}', 'polygon'),

  -- Row 4
  ('real-forest', '125', 'available', false, 7300, 535000, '{"x": 50, "y": 327, "width": 91, "height": 84}', 'polygon'),
  ('real-forest', '126', 'available', false, 6900, 505000, '{"x": 151, "y": 327, "width": 86, "height": 84}', 'polygon'),
  ('real-forest', '127', 'sold', false, 7100, 520000, '{"x": 247, "y": 327, "width": 89, "height": 84}', 'polygon'),
  ('real-forest', '128', 'available', false, 7400, 540000, '{"x": 346, "y": 327, "width": 92, "height": 84}', 'polygon'),
  ('real-forest', '129', 'reserved', false, 6700, 490000, '{"x": 448, "y": 327, "width": 84, "height": 84}', 'polygon'),
  ('real-forest', '130', 'available', false, 7600, 555000, '{"x": 542, "y": 327, "width": 95, "height": 84}', 'polygon'),
  ('real-forest', '131', 'available', false, 7200, 525000, '{"x": 647, "y": 327, "width": 90, "height": 84}', 'polygon'),
  ('real-forest', '132', 'available', false, 6800, 495000, '{"x": 747, "y": 327, "width": 85, "height": 84}', 'polygon'),

  -- Row 5
  ('real-forest', '133', 'available', false, 7500, 545000, '{"x": 50, "y": 421, "width": 94, "height": 83}', 'polygon'),
  ('real-forest', '134', 'sold', false, 7000, 515000, '{"x": 154, "y": 421, "width": 88, "height": 83}', 'polygon'),
  ('real-forest', '135', 'available', false, 7300, 535000, '{"x": 252, "y": 421, "width": 91, "height": 83}', 'polygon'),
  ('real-forest', '136', 'available', false, 6900, 505000, '{"x": 353, "y": 421, "width": 86, "height": 83}', 'polygon'),
  ('real-forest', '137', 'reserved', false, 7100, 520000, '{"x": 449, "y": 421, "width": 89, "height": 83}', 'polygon'),
  ('real-forest', '138', 'available', false, 7400, 540000, '{"x": 548, "y": 421, "width": 92, "height": 83}', 'polygon'),
  ('real-forest', '139', 'available', false, 6700, 490000, '{"x": 650, "y": 421, "width": 84, "height": 83}', 'polygon'),
  ('real-forest', '140', 'available', false, 7600, 555000, '{"x": 744, "y": 421, "width": 95, "height": 83}', 'polygon');