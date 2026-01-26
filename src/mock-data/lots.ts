export type LotStatus = 'available' | 'qa' | 'reserved' | 'sold'

export interface Lot {
  id: string
  lot_number: string
  community_id: string
  status: LotStatus
  moveInReady: boolean
  move_in_ready?: boolean
  plan_id?: string
  plan_name?: string
  sqft?: number
  price?: number
  position?: {
    points?: string
    x?: number
    y?: number
  }
  shape_type?: 'polygon' | 'rect' | 'circle'
}

export const communityLots: Record<string, Lot[]> = {
  'whispering-hills': [
    { id: '801', lot_number: '801', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '420,220 500,220 500,300 420,300' }, shape_type: 'polygon' },
    { id: '802', lot_number: '802', community_id: 'whispering-hills', status: 'qa', moveInReady: false, position: { points: '520,220 600,220 600,300 520,300' }, shape_type: 'polygon' },
    { id: '803', lot_number: '803', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '620,220 700,220 700,300 620,300' }, shape_type: 'polygon' },
    { id: '804', lot_number: '804', community_id: 'whispering-hills', status: 'reserved', moveInReady: true, position: { points: '720,220 800,220 800,300 720,300' }, shape_type: 'polygon' },
    { id: '805', lot_number: '805', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '820,220 900,220 900,300 820,300' }, shape_type: 'polygon' },
    { id: '806', lot_number: '806', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '920,220 1000,220 1000,300 920,300' }, shape_type: 'polygon' },
    { id: '807', lot_number: '807', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '1020,220 1100,220 1100,300 1020,300' }, shape_type: 'polygon' },
    { id: '808', lot_number: '808', community_id: 'whispering-hills', status: 'reserved', moveInReady: true, position: { points: '420,320 500,320 500,400 420,400' }, shape_type: 'polygon' },
    { id: '809', lot_number: '809', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '520,320 600,320 600,400 520,400' }, shape_type: 'polygon' },
    { id: '810', lot_number: '810', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '620,320 700,320 700,400 620,400' }, shape_type: 'polygon' },
    { id: '811', lot_number: '811', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '720,320 800,320 800,400 720,400' }, shape_type: 'polygon' },
    { id: '812', lot_number: '812', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '820,320 900,320 900,400 820,400' }, shape_type: 'polygon' },
    { id: '813', lot_number: '813', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '920,320 1000,320 1000,400 920,400' }, shape_type: 'polygon' },
    { id: '814', lot_number: '814', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '1020,320 1100,320 1100,400 1020,400' }, shape_type: 'polygon' },
    { id: '815', lot_number: '815', community_id: 'whispering-hills', status: 'available', moveInReady: true, position: { points: '420,420 500,420 500,500 420,500' }, shape_type: 'polygon' },
    { id: '816', lot_number: '816', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '520,420 600,420 600,500 520,500' }, shape_type: 'polygon' },
    { id: '817', lot_number: '817', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '620,420 700,420 700,500 620,500' }, shape_type: 'polygon' },
    { id: '818', lot_number: '818', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '720,420 800,420 800,500 720,500' }, shape_type: 'polygon' },
    { id: '819', lot_number: '819', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '820,420 900,420 900,500 820,500' }, shape_type: 'polygon' },
    { id: '820', lot_number: '820', community_id: 'whispering-hills', status: 'reserved', moveInReady: true, position: { points: '920,420 1000,420 1000,500 920,500' }, shape_type: 'polygon' },
    { id: '821', lot_number: '821', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '1020,420 1100,420 1100,500 1020,500' }, shape_type: 'polygon' },
    { id: '822', lot_number: '822', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '520,520 620,520 620,600 520,600' }, shape_type: 'polygon' },
    { id: '823', lot_number: '823', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '640,520 740,520 740,600 640,600' }, shape_type: 'polygon' },
    { id: '824', lot_number: '824', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '760,520 860,520 860,600 760,600' }, shape_type: 'polygon' },
    { id: '825', lot_number: '825', community_id: 'whispering-hills', status: 'available', moveInReady: false, position: { points: '880,520 980,520 980,600 880,600' }, shape_type: 'polygon' },
    { id: '826', lot_number: '826', community_id: 'whispering-hills', status: 'reserved', moveInReady: false, position: { points: '1000,520 1100,520 1100,600 1000,600' }, shape_type: 'polygon' },
  ],
  'riverside-estates': [
    { id: '801', lot_number: '801', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '420,220 500,220 500,300 420,300' }, shape_type: 'polygon' },
    { id: '802', lot_number: '802', community_id: 'riverside-estates', status: 'qa', moveInReady: false, position: { points: '520,220 600,220 600,300 520,300' }, shape_type: 'polygon' },
    { id: '803', lot_number: '803', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '620,220 700,220 700,300 620,300' }, shape_type: 'polygon' },
    { id: '804', lot_number: '804', community_id: 'riverside-estates', status: 'reserved', moveInReady: true, position: { points: '720,220 800,220 800,300 720,300' }, shape_type: 'polygon' },
    { id: '805', lot_number: '805', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '820,220 900,220 900,300 820,300' }, shape_type: 'polygon' },
    { id: '806', lot_number: '806', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '920,220 1000,220 1000,300 920,300' }, shape_type: 'polygon' },
    { id: '807', lot_number: '807', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '1020,220 1100,220 1100,300 1020,300' }, shape_type: 'polygon' },
    { id: '808', lot_number: '808', community_id: 'riverside-estates', status: 'reserved', moveInReady: true, position: { points: '420,320 500,320 500,400 420,400' }, shape_type: 'polygon' },
    { id: '809', lot_number: '809', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '520,320 600,320 600,400 520,400' }, shape_type: 'polygon' },
    { id: '810', lot_number: '810', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '620,320 700,320 700,400 620,400' }, shape_type: 'polygon' },
    { id: '811', lot_number: '811', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '720,320 800,320 800,400 720,400' }, shape_type: 'polygon' },
    { id: '812', lot_number: '812', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '820,320 900,320 900,400 820,400' }, shape_type: 'polygon' },
    { id: '813', lot_number: '813', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '920,320 1000,320 1000,400 920,400' }, shape_type: 'polygon' },
    { id: '814', lot_number: '814', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '1020,320 1100,320 1100,400 1020,400' }, shape_type: 'polygon' },
    { id: '815', lot_number: '815', community_id: 'riverside-estates', status: 'available', moveInReady: true, position: { points: '420,420 500,420 500,500 420,500' }, shape_type: 'polygon' },
    { id: '816', lot_number: '816', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '520,420 600,420 600,500 520,500' }, shape_type: 'polygon' },
    { id: '817', lot_number: '817', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '620,420 700,420 700,500 620,500' }, shape_type: 'polygon' },
    { id: '818', lot_number: '818', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '720,420 800,420 800,500 720,500' }, shape_type: 'polygon' },
    { id: '819', lot_number: '819', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '820,420 900,420 900,500 820,500' }, shape_type: 'polygon' },
    { id: '820', lot_number: '820', community_id: 'riverside-estates', status: 'reserved', moveInReady: true, position: { points: '920,420 1000,420 1000,500 920,500' }, shape_type: 'polygon' },
    { id: '821', lot_number: '821', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '1020,420 1100,420 1100,500 1020,500' }, shape_type: 'polygon' },
    { id: '822', lot_number: '822', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '520,520 620,520 620,600 520,600' }, shape_type: 'polygon' },
    { id: '823', lot_number: '823', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '640,520 740,520 740,600 640,600' }, shape_type: 'polygon' },
    { id: '824', lot_number: '824', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '760,520 860,520 860,600 760,600' }, shape_type: 'polygon' },
    { id: '825', lot_number: '825', community_id: 'riverside-estates', status: 'available', moveInReady: false, position: { points: '880,520 980,520 980,600 880,600' }, shape_type: 'polygon' },
    { id: '826', lot_number: '826', community_id: 'riverside-estates', status: 'reserved', moveInReady: false, position: { points: '1000,520 1100,520 1100,600 1000,600' }, shape_type: 'polygon' },
  ]
}
