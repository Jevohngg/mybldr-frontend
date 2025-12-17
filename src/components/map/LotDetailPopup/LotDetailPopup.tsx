import React from 'react'
import { Lot } from '../types'
import styles from './LotDetailPopup.module.css'

interface LotDetailPopupProps {
  lot: Lot
  position: { x: number; y: number }
  onClose: () => void
}

export default function LotDetailPopup({ lot, position, onClose }: LotDetailPopupProps) {
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

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={styles.popup}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className={styles.header}>
          <div className={styles.title}>Lot {lot.lot_number}</div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.label}>Status:</span>
            <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(lot.status) }}>
              {getStatusLabel(lot.status)}
            </span>
          </div>

          {lot.plan_name && (
            <div className={styles.row}>
              <span className={styles.label}>Plan:</span>
              <span className={styles.value}>{lot.plan_name}</span>
            </div>
          )}

          {lot.sqft && (
            <div className={styles.row}>
              <span className={styles.label}>Sq Ft:</span>
              <span className={styles.value}>{lot.sqft.toLocaleString()} sq ft</span>
            </div>
          )}

          {lot.price && (
            <div className={styles.row}>
              <span className={styles.label}>Price:</span>
              <span className={styles.value}>{formatPrice(lot.price)}</span>
            </div>
          )}

          {(lot.moveInReady || lot.move_in_ready) && (
            <div className={styles.badge}>
              <span className={styles.star}>★</span> Move In Ready
            </div>
          )}
        </div>

        {lot.status === 'available' && (
          <div className={styles.footer}>
            <button className={styles.actionButton}>View Details</button>
          </div>
        )}
      </div>
    </>
  )
}
