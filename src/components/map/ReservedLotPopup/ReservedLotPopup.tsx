import React from 'react'
import { Lot } from '../types'
import styles from './ReservedLotPopup.module.css'

interface ReservedLotPopupProps {
  lot: Lot
  position: { x: number; y: number }
  onClose: () => void
}

interface PlanDetails {
  name: string
  galtId: string
  beds: number
  baths: number
  sqft: number
  image: string
  selectionProgress: number
}

const reservedLotPlans: Record<string, PlanDetails> = {
  '801': {
    name: 'Charolette',
    galtId: '#155523',
    beds: 4,
    baths: 3,
    sqft: 2325,
    image: '/assets/plans/home-plan1.png',
    selectionProgress: 40
  },
  '803': {
    name: 'Aberdeen',
    galtId: '#155524',
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: '/assets/plans/home-plan2.png',
    selectionProgress: 65
  },
  '804': {
    name: 'Willowbrook',
    galtId: '#155525',
    beds: 4,
    baths: 3,
    sqft: 2400,
    image: '/assets/plans/home-plan3.png',
    selectionProgress: 25
  },
  '807': {
    name: 'Mountainview',
    galtId: '#155526',
    beds: 5,
    baths: 3,
    sqft: 2800,
    image: '/assets/plans/home-plan4.png',
    selectionProgress: 80
  },
  '808': {
    name: 'Serena',
    galtId: '#155527',
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: '/assets/plans/home-plan1.png',
    selectionProgress: 50
  },
  '811': {
    name: 'Charolette',
    galtId: '#155528',
    beds: 4,
    baths: 3,
    sqft: 2325,
    image: '/assets/plans/home-plan2.png',
    selectionProgress: 35
  },
  '812': {
    name: 'Aberdeen',
    galtId: '#155529',
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: '/assets/plans/home-plan3.png',
    selectionProgress: 70
  },
  '813': {
    name: 'Willowbrook',
    galtId: '#155530',
    beds: 4,
    baths: 3,
    sqft: 2400,
    image: '/assets/plans/home-plan4.png',
    selectionProgress: 45
  },
  '814': {
    name: 'Mountainview',
    galtId: '#155531',
    beds: 5,
    baths: 3,
    sqft: 2800,
    image: '/assets/plans/home-plan1.png',
    selectionProgress: 90
  },
  '816': {
    name: 'Serena',
    galtId: '#155532',
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: '/assets/plans/home-plan2.png',
    selectionProgress: 60
  },
  '817': {
    name: 'Charolette',
    galtId: '#155533',
    beds: 4,
    baths: 3,
    sqft: 2325,
    image: '/assets/plans/home-plan3.png',
    selectionProgress: 30
  },
  '820': {
    name: 'Aberdeen',
    galtId: '#155534',
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: '/assets/plans/home-plan4.png',
    selectionProgress: 55
  },
  '821': {
    name: 'Willowbrook',
    galtId: '#155535',
    beds: 4,
    baths: 3,
    sqft: 2400,
    image: '/assets/plans/home-plan1.png',
    selectionProgress: 75
  },
  '823': {
    name: 'Mountainview',
    galtId: '#155536',
    beds: 5,
    baths: 3,
    sqft: 2800,
    image: '/assets/plans/home-plan2.png',
    selectionProgress: 85
  },
  '824': {
    name: 'Serena',
    galtId: '#155537',
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: '/assets/plans/home-plan3.png',
    selectionProgress: 40
  },
  '826': {
    name: 'Charolette',
    galtId: '#155538',
    beds: 4,
    baths: 3,
    sqft: 2325,
    image: '/assets/plans/home-plan4.png',
    selectionProgress: 95
  }
}

export default function ReservedLotPopup({ lot, position, onClose }: ReservedLotPopupProps) {
  const planDetails = reservedLotPlans[lot.lot_number]

  if (!planDetails) {
    return null
  }

  const handlePopupInteraction = (e: React.MouseEvent | React.WheelEvent) => {
    e.stopPropagation()
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
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <img
            src={planDetails.image}
            alt={planDetails.name}
            className={styles.planImage}
          />
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.planName}>{planDetails.name}</h3>
          <p className={styles.galtId}>{planDetails.galtId}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="12" width="7" height="9" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="12" width="7" height="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 12L12 4L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{planDetails.beds}</span>
            </div>

            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{planDetails.baths}</span>
            </div>

            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L9 9M21 3L15 9M21 21L15 15M3 21L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>{planDetails.sqft.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <h4 className={styles.progressTitle}>Selection Progress</h4>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${planDetails.selectionProgress}%` }}
          />
        </div>
        <div className={styles.progressLabel}>{planDetails.selectionProgress}%</div>
      </div>
    </div>
  )
}
