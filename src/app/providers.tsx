import React from 'react'
import { communities as initialCommunities } from '../mock-data/communities'
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
}

export type Plan = typeof plans[number]

export type AppData = {
  communities: Community[]
  plans: Plan[]
  addCommunity: (community: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => void
}

const DataContext = React.createContext<AppData | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = React.useState<Community[]>(initialCommunities)

  const addCommunity = React.useCallback((newCommunity: Omit<Community, 'id' | 'thumbnail' | 'planIds'>) => {
    const id = newCommunity.name.toLowerCase().replace(/\s+/g, '-')
    const community: Community = {
      ...newCommunity,
      id,
      thumbnail: 'placeholder.png',
      planIds: [],
    }
    setCommunities(prev => [...prev, community])
  }, [])

  const value: AppData = { communities, plans, addCommunity }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
