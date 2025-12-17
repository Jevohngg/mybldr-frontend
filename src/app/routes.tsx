export const routes = {
  communities: '/communities',
  community: (id: string) => `/communities/${id}`,
  communityTab: (id: string, tab: string) => `/communities/${id}/${tab}`,
} as const

export type CommunityTab = 'overview' | 'hoa' | 'documents' | 'specifications'
