export const routes = {
  communities: '/communities',
  community: (id: string) => `/communities/${id}`,
  communityTab: (id: string, tab: string) => `/communities/${id}/${tab}`,
  reservedLot: (communityId: string, lotNumber: string) => `/communities/${communityId}/lots/${lotNumber}`,
  reservedLotTab: (communityId: string, lotNumber: string, tab: string) => `/communities/${communityId}/lots/${lotNumber}/${tab}`,
} as const

export type CommunityTab = 'overview' | 'hoa' | 'documents' | 'specifications'
export type ReservedLotTab = 'overview' | 'quotes' | 'documents'
