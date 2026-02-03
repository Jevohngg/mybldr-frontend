import styles from './PlanSummaryCard.module.css'

interface PlanSummaryCardProps {
  planName: string
  planImage: string
  beds: string
  baths: string
  sqft: string
}

export default function PlanSummaryCard({ planName, planImage, beds, baths, sqft }: PlanSummaryCardProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Selected Plan</h3>

      <div className={styles.planPreview}>
        <img src={planImage} alt={planName} className={styles.planImage} />
      </div>

      <div className={styles.planName}>{planName}</div>

      <div className={styles.specs}>
        <div className={styles.spec}>
          <span className={styles.specValue}>{beds}</span>
          <span className={styles.specLabel}>Beds</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specValue}>{baths}</span>
          <span className={styles.specLabel}>Baths</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specValue}>{sqft.replace(' ft²', '')}</span>
          <span className={styles.specLabel}>ft²</span>
        </div>
      </div>
    </div>
  )
}
