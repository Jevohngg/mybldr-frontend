import styles from './PlanDetailSideNav.module.css'

type TabType = 'overview' | 'plans'

interface PlanDetailSideNavProps {
  planName: string
  communityCount: number
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function PlanDetailSideNav({ planName, communityCount, activeTab, onTabChange }: PlanDetailSideNavProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 7h14M7 3v14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.planName}>{planName}</div>
          <div className={styles.communityCount}>{communityCount} Communities</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => onTabChange('overview')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.navIcon}>
            <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 5h12M5 2v12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Overview
        </button>

        <button
          className={`${styles.navItem} ${activeTab === 'plans' ? styles.active : ''}`}
          onClick={() => onTabChange('plans')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.navIcon}>
            <path d="M3 2h10M3 14h10M2 6h12M2 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Plans
        </button>
      </nav>
    </div>
  )
}
