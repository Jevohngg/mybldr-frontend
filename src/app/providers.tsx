import React from 'react'
import { communities as initialCommunities } from '../mock-data/communities'
import { plans } from '../mock-data/plans'
import { communityLots as initialLots, Lot } from '../mock-data/lots'
import { generateDefaultLots } from '../utils/generateLots'

export type Community = {
  id: string
  name: string
  division: string
  plans: number
  specs: string
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
  lots: Record<string, Lot[]>
  addCommunity: (community: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => void
}

const DataContext = React.createContext<AppData | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = React.useState<Community[]>(initialCommunities)
  const [lots, setLots] = React.useState<Record<string, Lot[]>>(initialLots)

  const addCommunity = React.useCallback((newCommunity: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => {
    const id = newCommunity.name.toLowerCase().replace(/\s+/g, '-')
    const community: Community = {
      ...newCommunity,
      id,
      thumbnail: 'placeholder.png',
      planIds: [],
      totalValue: '0',
      lotsAvailable: newCommunity.lots || 0,
      occupancyRate: 0,
      activeBuilds: 0,
      mapProjects: 0,
    }
    setCommunities(prev => [...prev, community])

    const defaultLots = generateDefaultLots(id)
    setLots(prev => ({ ...prev, [id]: defaultLots }))
  }, [])

  const value: AppData = { communities, plans, lots, addCommunity }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
