import React from 'react'
import { CommunityMapData, Lot } from '../types'
import { useData } from '../../../app/providers'

interface UseCommunityMapDataProps {
  communityId: string
  communityName: string
}

export function useCommunityMapData({ communityId, communityName }: UseCommunityMapDataProps) {
  const { lots: allLots } = useData()
  const [lots, setLots] = React.useState<Lot[]>([])
  const [mapImageUrl, setMapImageUrl] = React.useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const loadMapData = () => {
      setIsLoading(true)
      setError(null)

      try {
        const lotsData = allLots[communityId] || []
        setLots(lotsData)
      } catch (err) {
        console.error('Error loading map data:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMapData()
  }, [communityId, allLots])

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
