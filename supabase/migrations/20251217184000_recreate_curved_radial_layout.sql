/*
  # Recreate Curved Radial Lot Layout

  1. Changes
    - Complete redesign with organic curved radial layout
    - Lots arranged in horseshoe/arc pattern around central community roads
    - Natural puzzle-piece shapes that touch along shared edges
    - All lots fit within the community boundary

  2. Layout Design
    - Top curved arc: 804, 805, 806, 807, 808, 809, 810, 811 (8 lots)
    - Left perimeter: 803, 802, 801 (3 lots, 801 is QA/red)
    - Upper right curve: 816, 815, 814, 813, 812 (5 lots)
    - Center interior: 817, 818, 819, 820 (4 lots)
    - Lower curved section: 826, 825, 824, 823, 821, 822 (6 lots)

  3. Status Assignments
    - Available (blue): 805, 806, 809, 810, 815, 818, 819, 822, 825
    - Reserved (gray): 807, 812, 813, 814, 816, 817, 820, 821, 823, 824, 826, 802, 803, 804
    - QA (red): 801
    - Move-in Ready stars: 804, 808, 811, 815
*/

-- Clear existing lots
DELETE FROM lots WHERE community_id = 'silver-lake';

-- TOP CURVED ARC - 8 lots forming curved top perimeter (left to right: 804, 805, 806, 807, 808, 809, 810, 811)

INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

-- 804 (far left of top arc, reserved, move-in ready with star)
('804', 'silver-lake', 'reserved', true,
 '{"points": "320,240 380,220 440,215 460,260 420,295 360,305 310,280"}', 'polygon'),

-- 805 (touches 804 on right, available)
('805', 'silver-lake', 'available', false,
 '{"points": "460,215 525,205 590,205 610,250 570,285 500,290 460,260"}', 'polygon'),

-- 806 (touches 805 on right, available)
('806', 'silver-lake', 'available', false,
 '{"points": "610,205 680,200 745,205 760,250 720,285 650,288 610,250"}', 'polygon'),

-- 807 (touches 806 on right, reserved)
('807', 'silver-lake', 'reserved', false,
 '{"points": "760,205 825,202 885,208 895,255 850,285 785,286 760,250"}', 'polygon'),

-- 808 (touches 807 on right, reserved, move-in ready with star)
('808', 'silver-lake', 'reserved', true,
 '{"points": "895,208 960,210 1020,225 1020,275 970,290 905,285 895,255"}', 'polygon'),

-- 809 (touches 808 on right, available)
('809', 'silver-lake', 'available', false,
 '{"points": "1020,225 1080,240 1130,265 1120,315 1065,310 1010,295 1020,275"}', 'polygon'),

-- 810 (touches 809 on right, available)
('810', 'silver-lake', 'available', false,
 '{"points": "1130,265 1175,295 1200,335 1185,385 1135,370 1095,340 1120,315"}', 'polygon'),

-- 811 (touches 810 below, reserved, move-in ready with star)
('811', 'silver-lake', 'reserved', true,
 '{"points": "1200,335 1220,385 1225,440 1205,490 1155,470 1140,410 1185,385"}', 'polygon');

-- LEFT PERIMETER - 3 lots stacking vertically (803, 802, 801)

INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

-- 803 (upper left perimeter, reserved)
('803', 'silver-lake', 'reserved', false,
 '{"points": "310,280 360,305 380,365 375,425 320,435 285,405 280,340"}', 'polygon'),

-- 802 (middle left perimeter, reserved)
('802', 'silver-lake', 'reserved', false,
 '{"points": "280,340 285,405 290,470 285,535 240,540 225,475 230,410"}', 'polygon'),

-- 801 (lower left, QA status - RED lot)
('801', 'silver-lake', 'qa', false,
 '{"points": "230,475 240,540 250,605 245,670 195,665 185,600 190,535"}', 'polygon');

-- UPPER RIGHT CURVE - 5 lots (816, 815, 814, 813, 812)

INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

-- 816 (leftmost of upper interior, reserved)
('816', 'silver-lake', 'reserved', false,
 '{"points": "475,385 545,375 610,378 615,435 550,445 485,440"}', 'polygon'),

-- 815 (touches 816 on right, available, move-in ready with star)
('815', 'silver-lake', 'available', true,
 '{"points": "615,378 690,372 760,378 760,438 695,448 625,443 615,435"}', 'polygon'),

-- 814 (touches 815 on right, reserved)
('814', 'silver-lake', 'reserved', false,
 '{"points": "760,378 835,380 905,392 900,450 835,455 770,448 760,438"}', 'polygon'),

-- 813 (touches 814 on right, reserved)
('813', 'silver-lake', 'reserved', false,
 '{"points": "905,392 970,408 1025,435 1015,495 955,485 900,470 900,450"}', 'polygon'),

-- 812 (rightmost, touches 813 below, reserved)
('812', 'silver-lake', 'reserved', false,
 '{"points": "1140,410 1155,470 1160,530 1150,590 1105,580 1090,520 1095,460"}', 'polygon');

-- CENTER INTERIOR - 4 larger lots (817, 818, 819, 820)

INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

-- 817 (left center, reserved)
('817', 'silver-lake', 'reserved', false,
 '{"points": "420,495 490,485 555,490 560,565 495,575 430,565"}', 'polygon'),

-- 818 (touches 817 on right, available)
('818', 'silver-lake', 'available', false,
 '{"points": "560,490 635,485 715,495 715,575 640,585 565,575 560,565"}', 'polygon'),

-- 819 (large center lot, touches 818 on right, available)
('819', 'silver-lake', 'available', false,
 '{"points": "715,495 790,502 860,525 855,605 785,615 720,600 715,575"}', 'polygon'),

-- 820 (right center, reserved)
('820', 'silver-lake', 'reserved', false,
 '{"points": "900,470 955,485 1005,510 995,575 935,565 885,550 890,520 900,495"}', 'polygon');

-- LOWER CURVED SECTION - 6 lots (826, 825, 824, 823, 821, 822)

INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES

-- 826 (leftmost bottom, reserved)
('826', 'silver-lake', 'reserved', false,
 '{"points": "330,640 405,630 475,635 475,690 410,700 340,690"}', 'polygon'),

-- 825 (touches 826 on right, available)
('825', 'silver-lake', 'available', false,
 '{"points": "475,635 555,628 630,635 625,695 555,702 480,695 475,690"}', 'polygon'),

-- 824 (touches 825 on right, reserved)
('824', 'silver-lake', 'reserved', false,
 '{"points": "630,635 710,632 785,640 780,698 710,702 630,695"}', 'polygon'),

-- 823 (touches 824 on right, reserved)
('823', 'silver-lake', 'reserved', false,
 '{"points": "785,640 860,645 930,660 920,715 855,710 785,698"}', 'polygon'),

-- 821 (right of center, reserved)
('821', 'silver-lake', 'reserved', false,
 '{"points": "890,550 935,565 985,590 975,655 920,645 875,625 880,585"}', 'polygon'),

-- 822 (lower right, available)
('822', 'silver-lake', 'available', false,
 '{"points": "975,590 1025,615 1065,645 1050,700 990,685 945,665 975,655"}', 'polygon');
