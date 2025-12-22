import React from 'react'
import BaseModal from '../BaseModal/BaseModal'
import Button from '../../ui/Button'
import styles from './SelectPlanModal.module.css'

interface SelectPlanModalProps {
  open: boolean
  onClose: () => void
  onSelect: () => void
  plan: {
    id: string
    name: string
    beds: string
    baths: string
    aru: string
    image: string
    price?: string
    description?: string
  }
}

export default function SelectPlanModal({ open, onClose, onSelect, plan }: SelectPlanModalProps) {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false)

  const price = plan.price || '$489,900'
  const description = plan.description || `Welcome to The ${plan.name}, where timeless elegance meets modern comfort. This thoughtfully designed home features an open-concept living space bathed in natural light, seamlessly connecting the gourmet kitchen to a spacious great room—perfect for both everyday living and entertaining.`

  return (
    <BaseModal
      open={open}
      title=""
      onClose={onClose}
      width={940}
      footer={
        <div className={styles.footerButtons}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSelect}>
            Select Model
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <div className={styles.heroImage}>
          <img src={plan.image} alt={plan.name} className={styles.image} />
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.header}>
            <div className={styles.nameAndPrice}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.price}>Starting at {price}</div>
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
                <div className={styles.statValue}>{plan.aru.replace(' ft²', ',')}</div>
                <div className={styles.statLabel}>ft²</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Features</h3>
            <div className={styles.features}>
              <button
                className={styles.featureRow}
                onClick={() => setDetailsExpanded(!detailsExpanded)}
              >
                <span className={styles.featureLabel}>Detail</span>
                <span className={styles.featureChevron}>
                  {detailsExpanded ? '▼' : '▶'}
                </span>
              </button>

              {detailsExpanded && (
                <div className={styles.featureDetails}>
                  <div className={styles.featureDetailRow}>
                    <span className={styles.featureDetailLabel}>Name</span>
                    <span className={styles.featureDetailValue}>Aberdeen</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
