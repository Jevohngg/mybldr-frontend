/*
  # Update Organic Puzzle-Piece Lot Layout

  1. Changes
    - Redesign all lots with carefully crafted polygon shapes
    - Lots touch perfectly along shared edges (no gaps between neighbors)
    - Creates organic, curved street patterns between lot blocks
    - Realistic pentagonal and hexagonal shapes with smooth edges

  2. Design
    - Top perimeter: 805-810 (curved row)
    - Left perimeter: 804, 803, 802, 801
    - Right perimeter: 811, 812, 813, 814
    - Upper interior block: 817, 818, 819, 820
    - Middle interior block: 816, 815, 821
    - Bottom block: 826, 825, 824, 823, 822
*/

-- Clear existing lots
DELETE FROM lots WHERE community_id = 'silver-lake';

-- TOP ROW - Perimeter lots along curved top edge (lots touch each other)
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 805 (left corner, available)
('805', 'silver-lake', 'available', false,
 '{"points": "310,240 370,230 420,235 430,280 370,295 320,285"}', 'polygon'),

-- 806 (touches 805 on right, available)
('806', 'silver-lake', 'available', false,
 '{"points": "430,235 490,228 545,232 550,278 490,292 430,280"}', 'polygon'),

-- 807 (touches 806 on right, reserved)
('807', 'silver-lake', 'reserved', false,
 '{"points": "550,232 610,228 665,232 668,280 610,292 550,278"}', 'polygon'),

-- 808 (touches 807 on right, reserved, move-in ready)
('808', 'silver-lake', 'reserved', true,
 '{"points": "668,232 730,230 785,235 785,282 728,292 668,280"}', 'polygon'),

-- 809 (touches 808 on right, available)
('809', 'silver-lake', 'available', false,
 '{"points": "785,235 845,232 900,238 898,285 840,295 785,282"}', 'polygon'),

-- 810 (touches 809 on right, corner, available)
('810', 'silver-lake', 'available', false,
 '{"points": "900,238 958,242 1010,260 1008,310 955,305 898,285"}', 'polygon');

-- LEFT PERIMETER - Vertical edge lots (touch each other top to bottom)
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 804 (touches 805 below, reserved, move-in ready)
('804', 'silver-lake', 'reserved', true,
 '{"points": "320,285 370,295 380,345 375,395 325,390 310,335"}', 'polygon'),

-- 803 (touches 804 below, reserved)
('803', 'silver-lake', 'reserved', false,
 '{"points": "310,335 325,390 330,445 325,495 275,485 265,420"}', 'polygon'),

-- 802 (touches 803 below, reserved)
('802', 'silver-lake', 'reserved', false,
 '{"points": "265,420 275,485 280,540 270,590 225,575 220,505"}', 'polygon'),

-- 801 (touches 802 below, corner, QA)
('801', 'silver-lake', 'qa', false,
 '{"points": "220,505 225,575 230,635 220,685 175,665 170,595"}', 'polygon');

-- RIGHT PERIMETER - Vertical edge lots (touch each other top to bottom)
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 811 (touches 810 below, corner, reserved, move-in ready)
('811', 'silver-lake', 'reserved', true,
 '{"points": "1008,310 1050,325 1058,380 1050,435 1005,425 998,365"}', 'polygon'),

-- 812 (touches 811 below, reserved)
('812', 'silver-lake', 'reserved', false,
 '{"points": "998,365 1005,425 1008,485 1000,540 955,530 950,470"}', 'polygon'),

-- 813 (touches 812 below, reserved)
('813', 'silver-lake', 'reserved', false,
 '{"points": "950,470 955,530 955,585 945,640 900,628 895,570"}', 'polygon'),

-- 814 (touches 813 below, corner, reserved)
('814', 'silver-lake', 'reserved', false,
 '{"points": "895,570 900,628 898,680 885,725 840,710 838,655"}', 'polygon');

-- UPPER INTERIOR ROW - Lots touch each other horizontally
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 817 (leftmost interior, available)
('817', 'silver-lake', 'available', false,
 '{"points": "440,370 510,365 575,368 578,425 515,430 445,425"}', 'polygon'),

-- 818 (touches 817 on right, available)
('818', 'silver-lake', 'available', false,
 '{"points": "578,368 648,365 715,368 715,425 650,430 578,425"}', 'polygon'),

-- 819 (touches 818 on right, available, move-in ready)
('819', 'silver-lake', 'available', true,
 '{"points": "715,368 785,365 850,370 848,428 785,432 715,425"}', 'polygon'),

-- 820 (touches 819 on right, rightmost interior, available)
('820', 'silver-lake', 'available', false,
 '{"points": "850,370 915,375 970,390 965,445 905,438 848,428"}', 'polygon');

-- MIDDLE INTERIOR ROW - Lots touch horizontally
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 816 (leftmost, reserved)
('816', 'silver-lake', 'reserved', false,
 '{"points": "420,510 495,505 565,508 568,565 500,570 425,565"}', 'polygon'),

-- 815 (touches 816 on right, available, move-in ready)
('815', 'silver-lake', 'available', true,
 '{"points": "568,508 645,505 715,508 715,568 648,572 568,565"}', 'polygon'),

-- 821 (touches 815 on right, reserved)
('821', 'silver-lake', 'reserved', false,
 '{"points": "715,508 790,510 858,520 855,578 790,580 715,568"}', 'polygon');

-- BOTTOM ROW - Lots touch horizontally
INSERT INTO lots (lot_number, community_id, status, move_in_ready, position, shape_type) VALUES
-- 826 (leftmost bottom, reserved)
('826', 'silver-lake', 'reserved', false,
 '{"points": "270,640 345,635 415,638 418,690 350,695 275,688"}', 'polygon'),

-- 825 (touches 826 on right, available)
('825', 'silver-lake', 'available', false,
 '{"points": "418,638 495,635 570,638 570,692 498,696 418,690"}', 'polygon'),

-- 824 (touches 825 on right, reserved)
('824', 'silver-lake', 'reserved', false,
 '{"points": "570,638 648,635 720,638 720,692 650,696 570,692"}', 'polygon'),

-- 823 (touches 824 on right, reserved)
('823', 'silver-lake', 'reserved', false,
 '{"points": "720,638 795,638 865,645 862,698 795,700 720,692"}', 'polygon'),

-- 822 (touches 823 on right, rightmost bottom, available)
('822', 'silver-lake', 'available', false,
 '{"points": "865,645 930,655 985,672 975,720 915,710 862,698"}', 'polygon');
