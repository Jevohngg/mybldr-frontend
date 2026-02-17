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

export interface CommunityMapData {
  communityId: string
  communityName: string
  lots: Lot[]
  mapImageUrl?: string
  communityPlanIds?: string[]
}

export interface MapLegendItem {
  label: string
  color: string
  type: 'status' | 'marker'
}
