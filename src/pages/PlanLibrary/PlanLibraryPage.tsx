import React from 'react'
import Button from '../../components/ui/Button'
import PlanCard from '../../components/cards/PlanCard/PlanCard'
import { useData } from '../../app/providers'
import styles from './PlanLibraryPage.module.css'

export default function PlanLibraryPage() {
  const { plans } = useData()

  return (
    <div className={styles.page}>
      <div className="pageTitleRow">
        <div className="h1">Plan Library</div>
        <Button variant="primary">
          <span className={styles.buttonContent}>
            <img
              src="/assets/icons/plus.svg"
              alt=""
              className={styles.buttonIcon}
              draggable={false}
            />
            <span>Add New</span>
          </span>
        </Button>
      </div>

      <div className={styles.filtersRow}>
        <div className={`pill ${styles.pill} ${styles.pillLeft}`}>
          <span>Active</span>
          <img
            src="/assets/icons/chevron-down.svg"
            alt=""
            className={styles.pillChevron}
            draggable={false}
          />
        </div>

        <div className={styles.rightFilters}>
          <div className={`pill ${styles.pill}`}>
            <img
              src="/assets/icons/filter.svg"
              alt=""
              className={styles.pillIcon}
              draggable={false}
            />
            <span>Filter</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {plans.map(p => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  )
}
