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

export function generateDefaultLots(communityId: string): Lot[] {
  const lots: Lot[] = []

  const row1 = [
    { x1: 420, y1: 220, x2: 500, y2: 300 },
    { x1: 520, y1: 220, x2: 600, y2: 300 },
    { x1: 620, y1: 220, x2: 700, y2: 300 },
    { x1: 720, y1: 220, x2: 800, y2: 300 },
    { x1: 820, y1: 220, x2: 900, y2: 300 },
    { x1: 920, y1: 220, x2: 1000, y2: 300 },
    { x1: 1020, y1: 220, x2: 1100, y2: 300 },
  ]

  const row2 = [
    { x1: 420, y1: 320, x2: 500, y2: 400 },
    { x1: 520, y1: 320, x2: 600, y2: 400 },
    { x1: 620, y1: 320, x2: 700, y2: 400 },
    { x1: 720, y1: 320, x2: 800, y2: 400 },
    { x1: 820, y1: 320, x2: 900, y2: 400 },
    { x1: 920, y1: 320, x2: 1000, y2: 400 },
    { x1: 1020, y1: 320, x2: 1100, y2: 400 },
  ]

  const row3 = [
    { x1: 420, y1: 420, x2: 500, y2: 500 },
    { x1: 520, y1: 420, x2: 600, y2: 500 },
    { x1: 620, y1: 420, x2: 700, y2: 500 },
    { x1: 720, y1: 420, x2: 800, y2: 500 },
    { x1: 820, y1: 420, x2: 900, y2: 500 },
    { x1: 920, y1: 420, x2: 1000, y2: 500 },
    { x1: 1020, y1: 420, x2: 1100, y2: 500 },
  ]

  const row4 = [
    { x1: 520, y1: 520, x2: 620, y2: 600 },
    { x1: 640, y1: 520, x2: 740, y2: 600 },
    { x1: 760, y1: 520, x2: 860, y2: 600 },
    { x1: 880, y1: 520, x2: 980, y2: 600 },
    { x1: 1000, y1: 520, x2: 1100, y2: 600 },
  ]

  const allPositions = [...row1, ...row2, ...row3, ...row4]

  for (let i = 0; i < allPositions.length; i++) {
    const pos = allPositions[i]
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
        points: `${pos.x1},${pos.y1} ${pos.x2},${pos.y1} ${pos.x2},${pos.y2} ${pos.x1},${pos.y2}`
      },
      shape_type: 'polygon'
    })
  }

  return lots
}
