import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lot } from '../types'
import { routes } from '../../../app/routes'
import { getPlanById } from '../../../mock-data/plans'
import Button from '../../ui/Button'
import styles from './ReservedLotPopup.module.css'

interface ReservedLotPopupProps {
  lot: Lot
  position: { x: number; y: number }
  onClose: () => void
}

interface LotPlanMapping {
  planId: string
  galtId: string
  selectionProgress: number
}

const reservedLotPlans: Record<string, LotPlanMapping> = {
  '801': { planId: 'aspen', galtId: '#155523', selectionProgress: 40 },
  '803': { planId: 'aspen', galtId: '#155524', selectionProgress: 65 },
  '804': { planId: 'woodford', galtId: '#155525', selectionProgress: 25 },
  '807': { planId: 'serena', galtId: '#155526', selectionProgress: 80 },
  '808': { planId: 'serena', galtId: '#155527', selectionProgress: 50 },
  '811': { planId: 'aspen', galtId: '#155528', selectionProgress: 35 },
  '812': { planId: 'aspen', galtId: '#155529', selectionProgress: 70 },
  '813': { planId: 'woodford', galtId: '#155530', selectionProgress: 45 },
  '814': { planId: 'serena', galtId: '#155531', selectionProgress: 90 },
  '816': { planId: 'serena', galtId: '#155532', selectionProgress: 60 },
  '817': { planId: 'aspen', galtId: '#155533', selectionProgress: 30 },
  '820': { planId: 'aspen', galtId: '#155534', selectionProgress: 55 },
  '821': { planId: 'woodford', galtId: '#155535', selectionProgress: 75 },
  '823': { planId: 'serena', galtId: '#155536', selectionProgress: 85 },
  '824': { planId: 'serena', galtId: '#155537', selectionProgress: 40 },
  '826': { planId: 'aspen', galtId: '#155538', selectionProgress: 95 },
}

const defaultLotMapping: LotPlanMapping = {
  planId: 'aspen',
  galtId: '#000000',
  selectionProgress: 35,
}

export default function ReservedLotPopup({ lot, position, onClose }: ReservedLotPopupProps) {
  const navigate = useNavigate()
  const { communityId } = useParams<{ communityId: string }>()
  const lotMapping = reservedLotPlans[lot.lot_number] || defaultLotMapping
  const plan = getPlanById(lotMapping.planId)

  const handlePopupInteraction = (e: React.MouseEvent | React.WheelEvent) => {
    e.stopPropagation()
  }

  const handleNavigate = () => {
    navigate(routes.reservedLot(communityId || '', lot.lot_number))
  }

  return (
    <div
      className={styles.popup}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handlePopupInteraction}
      onWheel={handlePopupInteraction}
      onMouseDown={handlePopupInteraction}
    >
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </Button>

      <div className={styles.content} onClick={handleNavigate} style={{ cursor: 'pointer' }}>
        <div className={styles.imageSection}>
          <img
            src={plan?.image || '/assets/plans/placeholder.jpg'}
            alt={plan?.name || 'Plan'}
            className={styles.planImage}
          />
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.planName}>{plan?.name || 'Assigned Plan'}</h3>
          <p className={styles.galtId}>{lotMapping.galtId}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="12" width="7" height="9" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="12" width="7" height="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 12L12 4L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{plan?.beds}</span>
            </div>

            <div className={styles.feature}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{plan?.baths}</span>
            </div>

            <div className={styles.feature}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L9 9M21 3L15 9M21 21L15 15M3 21L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>{plan?.totalFinishedSqft?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <h4 className={styles.progressTitle}>Selection Progress</h4>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${lotMapping.selectionProgress}%` }}
          />
        </div>
        <div className={styles.progressLabel}>{lotMapping.selectionProgress}%</div>
      </div>
    </div>
  )
}
