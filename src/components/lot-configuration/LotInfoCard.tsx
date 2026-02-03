import styles from './LotInfoCard.module.css'

interface LotInfoCardProps {
  lotNumber: string
  status: string
  sqft?: number
  communityName: string
}

export default function LotInfoCard({ lotNumber, status, sqft, communityName }: LotInfoCardProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lot Information</h3>

      <div className={styles.row}>
        <span className={styles.label}>Lot Number</span>
        <span className={styles.value}>{lotNumber}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Status</span>
        <span className={styles.statusBadge}>{status}</span>
      </div>

      {sqft && (
        <div className={styles.row}>
          <span className={styles.label}>Lot Size</span>
          <span className={styles.value}>{sqft.toLocaleString()} ft²</span>
        </div>
      )}

      <div className={styles.row}>
        <span className={styles.label}>Community</span>
        <span className={styles.value}>{communityName}</span>
      </div>
    </div>
  )
}
