import React from 'react'
import styles from './PlanFeatures.module.css'

interface PlanFeaturesProps {
  features?: string[]
  isLoading?: boolean
  isPopulated?: boolean
}

export default function PlanFeatures({ features, isLoading = false }: PlanFeaturesProps) {
  const defaultFeatures = [
    'Finished Lower Level',
    'Covered porch/patio',
    'Office/Flex Space',
    'Kitchen island',
    'Family room',
    'Bonus room',
    'Pocket Door',
    'Fireplace'
  ]

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Plan Features</h3>
      <div className={`${styles.featuresGrid} ${isLoading ? styles.featuresGridLoading : ''}`}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.fieldSpinner}>
              <svg className={styles.fieldSpinnerSvg} viewBox="0 0 50 50">
                <circle className={styles.fieldSpinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            </div>
          </div>
        )}
        {displayFeatures.map((feature) => (
          <button key={feature} className={styles.featureTag} disabled={isLoading}>
            <span className={styles.featurePlus}>+</span>
            <span className={styles.featureText}>{feature}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
