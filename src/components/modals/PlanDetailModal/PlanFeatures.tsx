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
      <h2 className={styles.title}>Plan Features</h2>
      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <div key={feature} className={styles.featureTag}>
            <span className={styles.featurePlus}>+</span>
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
