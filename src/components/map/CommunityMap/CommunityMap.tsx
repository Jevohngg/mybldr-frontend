import React from 'react'
import styles from './CommunityMap.module.css'
import LotDetailPopup from '../LotDetailPopup/LotDetailPopup'
import ReservedLotPopup from '../ReservedLotPopup/ReservedLotPopup'
import SelectPlanModal from '../../modals/SelectPlanModal/SelectPlanModal'
import { CommunityMapData, Lot, LotStatus } from '../types'

interface Plan {
  id: string
  name: string
  beds: string
  baths: string
  aru: string
  image: string
}

interface IframeLotPayload {
  lotId: string
  lotNumber: string
  status: string
  metadata?: object
}

interface CommunityMapProps {
  data: CommunityMapData
}

const IFRAME_URL = 'https://interactive-communit-e1t4.bolt.host/'

function mapIframeStatusToLocal(iframeStatus: string): LotStatus {
  switch (iframeStatus) {
    case 'available':
      return 'available'
    case 'sold':
      return 'sold'
    case 'reserved':
      return 'reserved'
    case 'pending':
      return 'reserved'
    case 'model':
      return 'available'
    case 'unavailable':
      return 'sold'
    default:
      return 'available'
  }
}

function formatLotNumber(iframeLotNumber: string): string {
  return iframeLotNumber
}

export default function CommunityMap({ data }: CommunityMapProps) {
  const { communityId } = data
  const canvasRef = React.useRef<HTMLDivElement>(null)

  const [selectedLot, setSelectedLot] = React.useState<Lot | null>(null)
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 })
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {}

      if (type === 'LOT_CLICKED' && payload) {
        const lotPayload = payload as IframeLotPayload
        const localLotNumber = formatLotNumber(lotPayload.lotNumber)
        const localStatus = mapIframeStatusToLocal(lotPayload.status)

        const virtualLot: Lot = {
          id: `lot-${localLotNumber}`,
          lot_number: localLotNumber,
          community_id: communityId,
          status: localStatus,
          moveInReady: false,
          sqft: 7500,
        }

        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect()
          setPopupPosition({
            x: rect.width / 2,
            y: rect.height / 2,
          })
        }

        setSelectedLot(virtualLot)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [communityId])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLot) {
        setSelectedLot(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLot])

  const handleSelectPlan = () => {
    if (selectedPlan && selectedLot) {
      console.log(`Assigning plan ${selectedPlan.name} to lot ${selectedLot.lot_number}`)
      setSelectedPlan(null)
      setSelectedLot(null)
    }
  }

  const shouldShowReservedPopup = selectedLot && (selectedLot.status === 'reserved' || selectedLot.status === 'sold')

  return (
    <div className={styles.wrap}>
      <div ref={canvasRef} className={styles.canvas}>
        <iframe
          src={IFRAME_URL}
          className={styles.mapIframe}
          title="Community Map"
          allow="fullscreen"
        />

        {selectedLot && (
          shouldShowReservedPopup ? (
            <ReservedLotPopup
              lot={selectedLot}
              position={popupPosition}
              onClose={() => setSelectedLot(null)}
            />
          ) : (
            <LotDetailPopup
              lot={selectedLot}
              position={popupPosition}
              onClose={() => setSelectedLot(null)}
              onPlanClick={setSelectedPlan}
            />
          )
        )}
      </div>

      {selectedPlan && (
        <SelectPlanModal
          open={true}
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSelect={handleSelectPlan}
        />
      )}
    </div>
  )
}
