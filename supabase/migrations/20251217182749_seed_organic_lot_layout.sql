/*
  # Seed Organic Lot Layout with Puzzle-Piece Design

  1. Changes
    - Insert Silver Lake community with organic layout
    - Insert all 26 lots with custom polygon shapes that fit together naturally
    - Lots are shaped as irregular polygons creating natural road spacing
    - Layout mimics realistic subdivision design with curved streets

  2. Notes
    - Each lot has unique polygon coordinates
    - Gaps between lots naturally form the road network
    - Corner and perimeter lots have larger, varied shapes
    - Interior lots are smaller with diverse geometries
*/

-- Insert Silver Lake community
INSERT INTO communities (id, name, division)
VALUES ('silver-lake', 'Silver Lake', 'North Division')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, division = EXCLUDED.division;

-- Clear existing lots for fresh seed
DELETE FROM lots WHERE community_id = 'silver-lake';

-- Insert lots with organic polygon shapes
-- Top row (curved along top perimeter)
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
('805', 'silver-lake', 'available', false,
 '{"points": "480,240 520,220 560,230 570,270 540,290 490,280"}', 'polygon'),

('806', 'silver-lake', 'available', false,
 '{"points": "570,230 610,215 650,225 660,265 630,285 580,270"}', 'polygon'),

('807', 'silver-lake', 'reserved', false,
 '{"points": "660,225 710,218 750,225 755,270 720,285 670,265"}', 'polygon'),

('808', 'silver-lake', 'reserved', true,
 '{"points": "755,225 800,220 840,228 842,275 810,288 765,270"}', 'polygon'),

('809', 'silver-lake', 'available', false,
 '{"points": "842,228 885,225 925,235 928,280 895,290 852,275"}', 'polygon'),

('810', 'silver-lake', 'available', false,
 '{"points": "928,235 965,240 1000,258 998,300 965,310 938,280"}', 'polygon'),

-- Left perimeter lots
('804', 'silver-lake', 'reserved', true,
 '{"points": "425,290 480,280 490,340 485,390 440,380 420,330"}', 'polygon'),

('803', 'silver-lake', 'reserved', false,
 '{"points": "420,390 440,395 485,405 480,465 440,475 415,440"}', 'polygon'),

('802', 'silver-lake', 'reserved', false,
 '{"points": "415,480 440,490 470,505 465,560 430,570 410,530"}', 'polygon'),

('801', 'silver-lake', 'qa', false,
 '{"points": "410,575 430,585 455,610 445,660 400,650 395,610"}', 'polygon'),

-- Right perimeter lots
('811', 'silver-lake', 'reserved', true,
 '{"points": "998,258 1035,270 1040,320 1032,370 995,365 978,310"}', 'polygon'),

('812', 'silver-lake', 'reserved', false,
 '{"points": "995,375 1032,380 1035,430 1028,480 990,475 975,425"}', 'polygon'),

('813', 'silver-lake', 'reserved', false,
 '{"points": "990,485 1028,490 1030,540 1020,585 985,580 970,535"}', 'polygon'),

('814', 'silver-lake', 'reserved', false,
 '{"points": "985,590 1020,595 1018,640 1008,680 975,670 965,630"}', 'polygon'),

-- Interior upper cluster
('817', 'silver-lake', 'available', false,
 '{"points": "580,380 640,375 680,385 685,435 645,445 585,440"}', 'polygon'),

('818', 'silver-lake', 'available', false,
 '{"points": "685,385 735,380 785,390 788,445 745,455 695,435"}', 'polygon'),

('819', 'silver-lake', 'available', true,
 '{"points": "788,390 835,388 880,398 882,450 840,460 798,445"}', 'polygon'),

('820', 'silver-lake', 'available', false,
 '{"points": "882,398 925,402 960,415 958,468 920,475 892,450"}', 'polygon'),

-- Interior lower cluster
('816', 'silver-lake', 'reserved', false,
 '{"points": "560,485 620,478 670,488 675,540 635,552 565,545"}', 'polygon'),

('815', 'silver-lake', 'available', true,
 '{"points": "675,488 730,483 780,495 782,548 738,558 685,540"}', 'polygon'),

('821', 'silver-lake', 'reserved', false,
 '{"points": "782,495 835,492 880,505 878,558 835,565 792,548"}', 'polygon'),

-- Bottom row
('826', 'silver-lake', 'reserved', false,
 '{"points": "460,615 510,605 555,615 558,665 518,675 470,668"}', 'polygon'),

('825', 'silver-lake', 'available', false,
 '{"points": "558,615 610,608 655,618 658,668 618,678 568,665"}', 'polygon'),

('824', 'silver-lake', 'reserved', false,
 '{"points": "658,618 708,612 755,622 758,672 715,680 668,668"}', 'polygon'),

('823', 'silver-lake', 'reserved', false,
 '{"points": "758,622 810,618 858,630 860,678 818,685 768,672"}', 'polygon'),

('822', 'silver-lake', 'available', false,
 '{"points": "860,630 908,635 950,650 945,695 905,698 870,678"}', 'polygon');
