import React from 'react'
import { supabase } from '../../../lib/supabase'
import { CommunityMapData, Lot } from '../types'

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
    const loadMapData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: lotsData, error: lotsError } = await supabase
          .from('lots')
          .select('*')
          .eq('community_id', communityId)
          .order('lot_number')

        if (lotsError) {
          throw lotsError
        }

        const transformedLots: Lot[] = (lotsData || []).map((lot) => ({
          id: lot.id,
          lot_number: lot.lot_number,
          community_id: lot.community_id,
          status: lot.status,
          moveInReady: lot.move_in_ready || false,
          move_in_ready: lot.move_in_ready || false,
          plan_id: lot.plan_id,
          plan_name: lot.plan_name,
          sqft: lot.sqft,
          price: lot.price,
          position: lot.position,
          shape_type: lot.shape_type || 'polygon',
        }))

        setLots(transformedLots)

        const { data: communityData } = await supabase
          .from('communities')
          .select('map_image_url')
          .eq('id', communityId)
          .maybeSingle()

        if (communityData?.map_image_url) {
          setMapImageUrl(communityData.map_image_url)
        }
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
