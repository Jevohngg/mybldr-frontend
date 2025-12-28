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
          <img src="/assets/icons/plan-detail-header2.svg" alt="" width="20" height="20" />
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
          <img src="/assets/icons/overview.svg" alt="" width="16" height="16" className={styles.navIcon} />
          Overview
        </button>

        <button
          className={`${styles.navItem} ${activeTab === 'plans' ? styles.active : ''}`}
          onClick={() => onTabChange('plans')}
        >
          <img src="/assets/icons/plans-list.svg" alt="" width="16" height="16" className={styles.navIcon} />
          Plans
        </button>
      </nav>
    </div>
  )
}
