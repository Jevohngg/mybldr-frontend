import React from 'react'
import { CommunityMapData, Lot } from '../types'
import { communityLots } from '../../../mock-data/lots'

interface UseCommunityMapDataProps {
  communityId: string
  communityName: string
}

export function useCommunityMapData({ communityId, communityName }: UseCommunityMapDataProps) {
  const [lots, setLots] = React.useState<Lot[]>([])
  const [mapImageUrl, setMapImageUrl] = React.useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const loadMapData = () => {
      setIsLoading(true)
      setError(null)

      try {
        const lotsData = communityLots[communityId] || []
        setLots(lotsData)
      } catch (err) {
        console.error('Error loading map data:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMapData()
  }, [communityId])

  const mapData: CommunityMapData = React.useMemo(() => ({
    communityId,
    communityName,
    lots,
    mapImageUrl,
  }), [communityId, communityName, lots, mapImageUrl])

  return {
    mapData,
    isLoading,
    error,
    refetch: () => {
      setLots([])
      setMapImageUrl(undefined)
    },
  }
}
