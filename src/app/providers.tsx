import React from 'react'
import { supabase } from '../lib/supabase'
import { plans } from '../mock-data/plans'

export type Community = {
  id: string
  name: string
  division: string
  plans: number
  specs: number
  lots: number
  thumbnail: string
  planIds: string[]
  totalValue?: string
  lotsAvailable?: number
  occupancyRate?: number
  activeBuilds?: number
  mapProjects?: number
}

export type Plan = typeof plans[number]

export type AppData = {
  communities: Community[]
  plans: Plan[]
  addCommunity: (community: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => Promise<void>
  refreshCommunities: () => Promise<void>
}

const DataContext = React.createContext<AppData | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = React.useState<Community[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const refreshCommunities = React.useCallback(async () => {
    try {
      const { data: dbCommunities, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const communitiesWithStats = await Promise.all(
        (dbCommunities || []).map(async (comm) => {
          const { data: lotsData } = await supabase
            .from('lots')
            .select('status')
            .eq('community_id', comm.id)

          const totalLots = lotsData?.length || 0
          const availableLots = lotsData?.filter(l => l.status === 'available').length || 0
          const soldLots = lotsData?.filter(l => l.status === 'sold').length || 0
          const occupancyRate = totalLots > 0 ? Math.round((soldLots / totalLots) * 100) : 0

          return {
            id: comm.id,
            name: comm.name,
            division: comm.division || 'Unknown',
            plans: 0,
            specs: 0,
            lots: totalLots,
            thumbnail: 'placeholder.png',
            planIds: [],
            totalValue: '0',
            lotsAvailable: availableLots,
            occupancyRate,
            activeBuilds: 0,
            mapProjects: totalLots,
          }
        })
      )

      setCommunities(communitiesWithStats)
    } catch (err) {
      console.error('Error loading communities:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshCommunities()
  }, [refreshCommunities])

  const addCommunity = React.useCallback(async (newCommunity: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => {
    const id = newCommunity.name.toLowerCase().replace(/\s+/g, '-')

    const { error: communityError } = await supabase
      .from('communities')
      .insert({
        id,
        name: newCommunity.name,
        division: newCommunity.division,
      })

    if (communityError) {
      console.error('Error creating community:', communityError)
      throw communityError
    }

    await generateLotsForCommunity(id, newCommunity.lots)
    await refreshCommunities()
  }, [refreshCommunities])

  const value: AppData = { communities, plans, addCommunity, refreshCommunities }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

async function generateLotsForCommunity(communityId: string, numberOfLots: number) {
  const lots = []
  const lotsPerRow = 8
  const rows = Math.ceil(numberOfLots / lotsPerRow)

  const lotWidth = 85
  const lotHeight = 82
  const spacing = 10
  const startX = 50
  const startY = 50

  const statuses: Array<'available' | 'reserved' | 'sold'> = ['available', 'available', 'available', 'available', 'available', 'reserved', 'sold']
  const prices = [495000, 505000, 515000, 525000, 535000, 545000, 555000]
  const sqfts = [6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600]

  for (let row = 0; row < rows; row++) {
    const lotsInThisRow = Math.min(lotsPerRow, numberOfLots - row * lotsPerRow)

    for (let col = 0; col < lotsInThisRow; col++) {
      const lotIndex = row * lotsPerRow + col
      const lotNumber = (101 + lotIndex).toString()

      const x = startX + col * (lotWidth + spacing)
      const y = startY + row * (lotHeight + spacing)
      const width = lotWidth + (lotIndex % 3) * 5
      const height = lotHeight + (lotIndex % 2) * 3

      lots.push({
        community_id: communityId,
        lot_number: lotNumber,
        status: statuses[lotIndex % statuses.length],
        move_in_ready: false,
        sqft: sqfts[lotIndex % sqfts.length],
        price: prices[lotIndex % prices.length],
        position: { x, y, width, height },
        shape_type: 'polygon',
      })
    }
  }

  const { error } = await supabase.from('lots').insert(lots)

  if (error) {
    console.error('Error generating lots:', error)
    throw error
  }
}
