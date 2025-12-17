import React from 'react'
import { communities } from '../mock-data/communities'
import { plans } from '../mock-data/plans'

export type Community = typeof communities[number]
export type Plan = typeof plans[number]

export type AppData = {
  communities: Community[]
  plans: Plan[]
}

const DataContext = React.createContext<AppData | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const value: AppData = { communities, plans }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
