import React from 'react'
import Button from '../../components/ui/Button'
import CommunityCard from '../../components/cards/CommunityCard/CommunityCard'
import AddCommunityModal from '../../components/modals/AddCommunityModal/AddCommunityModal'
import { useData } from '../../app/providers'
import styles from './CommunitiesPage.module.css'

export default function CommunitiesPage() {
  const { communities, addCommunity } = useData()
  const [open, setOpen] = React.useState(false)

  const handleSave = (payload: { name: string; division: string; plans: number; specs: string; lots: number }) => {
    addCommunity(payload)
    setOpen(false)
  }

  // Stats matching Figma design
  const stats = [
    { label: 'Active Sales', value: 120 },
    { label: 'Presale', value: 240 },
    { label: 'Under Development', value: 20 },
    { label: 'Total Lots', value: 220 },
  ]

  return (
    <div className={styles.page}>
      <div className="pageTitleRow">
        <div className="h1">Communities</div>
        <Button variant="primary" onClick={() => setOpen(true)}>
  <span className={styles.buttonContent}>
    <img
      src="/assets/icons/plus.svg"
      alt=""
      className={styles.buttonIcon}
      draggable={false}
    />
    <span>Add Community</span>
  </span>
</Button>

      </div>

      {/* Stats Row - Connected metric group */}
      <div className={styles.statsRow}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            {index > 0 && <div className={styles.statDivider} />}
            <div className={styles.stat}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className={styles.filtersRow}>
        <div className={`pill ${styles.pill} ${styles.pillLeft}`}>
          <span>Date Created</span>
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
              src=""
              alt=""
              className={styles.pillIcon}
              draggable={false}
            />
            <span>All Regions</span>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              className={styles.pillChevron}
              draggable={false}
            />
          </div>

          <div className={`pill ${styles.pill}`}>
            <img
              src=""
              alt=""
              className={styles.pillIcon}
              draggable={false}
            />
            <span>All Divisions</span>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              className={styles.pillChevron}
              draggable={false}
            />
          </div>

          <div className={`pill ${styles.pill}`}>
            <img
              src=""
              alt=""
              className={styles.pillIcon}
              draggable={false}
            />
            <span>Status</span>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              className={styles.pillChevron}
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {communities.map(c => (
          <CommunityCard key={c.id} community={c} />
        ))}
      </div>

      <AddCommunityModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
