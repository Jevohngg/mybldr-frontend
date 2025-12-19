import React, { useState } from 'react'
import { Lot } from '../types'
import { plans } from '../../../mock-data/plans'
import PlanDetailModal from '../../modals/PlanDetailModal/PlanDetailModal'
import styles from './LotDetailPopup.module.css'

interface LotDetailPopupProps {
  lot: Lot
  position: { x: number; y: number }
  onClose: () => void
}

interface Plan {
  id: string
  name: string
  beds: string
  baths: string
  aru: string
  image: string
}

export default function LotDetailPopup({ lot, position, onClose }: LotDetailPopupProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'qa':
        return 'QA'
      case 'reserved':
        return 'Reserved'
      case 'sold':
        return 'Sold'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4A90E2'
      case 'qa':
        return '#D94242'
      case 'reserved':
        return '#C9B8A0'
      case 'sold':
        return '#CCCCCC'
      default:
        return '#CCCCCC'
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for pricing'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const matchingPlans = lot.status === 'available' ? plans.slice(0, 8) : []

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

      <div className={styles.mainInfo}>
        <div className={styles.lotHeader}>
          <h3 className={styles.lotTitle}>Lot {lot.lot_number}</h3>
          <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(lot.status) }}>
            {getStatusLabel(lot.status)}
          </span>
        </div>

        {lot.sqft && (
          <div className={styles.lotSize}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L6 6M14 2L10 6M14 14L10 10M2 14L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 2H14V14H2V2Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {lot.sqft.toLocaleString()} ft²
          </div>
        )}
      </div>

      {lot.status === 'reserved' ? (
        <div className={styles.plansSection}>
          <h4 className={styles.sectionTitle}>Matching Plans</h4>
          <div className={styles.reservedMessage}>
            <p>This lot is reserved and there are no matching plans available at this time.</p>
          </div>
        </div>
      ) : matchingPlans.length > 0 ? (
        <div className={styles.plansSection}>
          <h4 className={styles.sectionTitle}>Matching Plans</h4>
          <div className={styles.plansList}>
            {matchingPlans.map((plan) => (
              <div
                key={plan.id}
                className={styles.planItem}
                onClick={() => setSelectedPlan(plan)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="/assets/plans/placeholder.png"
                  alt={plan.name}
                  className={styles.planImage}
                />
                <div className={styles.planDetails}>
                  <h5 className={styles.planName}>{plan.name}</h5>
                  <p className={styles.planPrice}>Starting at $489,900</p>
                  <div className={styles.planFeatures}>
                    <span className={styles.feature}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="8" width="5" height="6" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="9" y="8" width="5" height="6" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 8L8 3L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {plan.beds.split('-')[0]}
                    </span>
                    <span className={styles.feature}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {plan.baths.split('-')[0]}
                    </span>
                    <span className={styles.feature}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L6 6M14 2L10 6M14 14L10 10M2 14L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M2 2H14V14H2V2Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      {plan.aru}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  )
}
