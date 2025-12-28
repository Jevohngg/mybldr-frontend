import React from 'react'
import styles from './PlanFeatures.module.css'

export default function PlanFeatures() {
  const features = [
    'Finished Lower Level',
    'Covered porch/patio',
    'Office/Flex Space',
    'Kitchen island',
    'Family room',
    'Bonus room',
    'Pocket Door',
    'Fireplace'
  ]

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Plan Features</h3>
      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <button key={feature} className={styles.featureTag}>
            <span className={styles.featurePlus}>+</span>
            <span className={styles.featureText}>{feature}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
