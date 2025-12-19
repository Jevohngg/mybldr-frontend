import React, { useState, useEffect } from 'react'
import styles from './PlanDetailModal.module.css'

interface Plan {
  id: string
  name: string
  beds: string
  baths: string
  aru: string
  image: string
}

interface PlanDetailModalProps {
  plan: Plan
  onClose: () => void
  onSelect?: (plan: Plan) => void
}

export default function PlanDetailModal({ plan, onClose, onSelect }: PlanDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSelect = async () => {
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    if (onSelect) {
      onSelect(plan)
    }
    handleClose()
  }

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${isVisible ? styles.visible : ''}`}>
        <img
          src="/assets/plans/placeholder.png"
          alt={plan.name}
          className={styles.heroImage}
        />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.price}>
                Starting at <span className={styles.priceAmount}>$489,900</span>
              </p>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{plan.beds}</div>
                <div className={styles.statLabel}>Beds</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{plan.baths}</div>
                <div className={styles.statLabel}>baths</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{plan.aru.replace(' ft²', '')}</div>
                <div className={styles.statLabel}>ft²</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>
              Welcome to The {plan.name}, where timeless elegance meets modern comfort.
              This thoughtfully designed home features an open-concept living space bathed
              in natural light, seamlessly connecting the gourmet kitchen to a spacious
              great room—perfect for both everyday living and entertaining.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Features</h3>
            <div className={styles.featuresTable}>
              <div className={styles.featureRow}>
                <div className={styles.featureLabel}>Detail</div>
                <div className={styles.featureValue}></div>
              </div>
              <div className={styles.featureRow}>
                <div className={styles.featureLabel}>Name</div>
                <div className={styles.featureValue}>Aberdeen</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.selectButton}`}
            onClick={handleSelect}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Select Model'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
