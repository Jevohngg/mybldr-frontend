export type LotStatus = 'available' | 'qa' | 'reserved' | 'sold'

export const lots = [
  { id: '818', status: 'available' as LotStatus, moveInReady: false },
  { id: '819', status: 'available' as LotStatus, moveInReady: true },
  { id: '801', status: 'qa' as LotStatus, moveInReady: false },
]
