import { Lot, LotStatus } from '../mock-data/lots'

const LOT_STATUSES: LotStatus[] = ['available', 'reserved', 'qa', 'sold']

function getRandomStatus(): LotStatus {
  const weights = [0.4, 0.4, 0.1, 0.1]
  const random = Math.random()
  let sum = 0

  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random < sum) return LOT_STATUSES[i]
  }

  return 'available'
}

export function generateDefaultLots(communityId: string, count: number): Lot[] {
  const lots: Lot[] = []
  const startX = 420
  const startY = 220
  const lotWidth = 80
  const lotHeight = 80
  const lotsPerRow = 7

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / lotsPerRow)
    const col = i % lotsPerRow

    const x1 = startX + col * (lotWidth + 20)
    const y1 = startY + row * (lotHeight + 20)
    const x2 = x1 + lotWidth
    const y2 = y1 + lotHeight

    const lotNumber = String(801 + i)
    const status = getRandomStatus()
    const moveInReady = status === 'available' && Math.random() > 0.7

    lots.push({
      id: lotNumber,
      lot_number: lotNumber,
      community_id: communityId,
      status,
      moveInReady,
      position: {
        points: `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`
      },
      shape_type: 'polygon'
    })
  }

  return lots
}
