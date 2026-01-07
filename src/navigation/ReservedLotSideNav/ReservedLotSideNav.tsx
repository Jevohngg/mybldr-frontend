import styles from './ReservedLotSideNav.module.css'

type TabType = 'overview' | 'quotes' | 'documents'

interface ReservedLotSideNavProps {
  lotNumber: string
  communityName: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function ReservedLotSideNav({ lotNumber, communityName, activeTab, onTabChange }: ReservedLotSideNavProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <img src="/assets/icons/community.svg" alt="" width="20" height="20" />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.lotNumber}>Lot {lotNumber}</div>
          <div className={styles.communityName}>{communityName}</div>
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
          className={`${styles.navItem} ${activeTab === 'quotes' ? styles.active : ''}`}
          onClick={() => onTabChange('quotes')}
        >
          <img src="/assets/icons/quotes.svg" alt="" width="16" height="16" className={styles.navIcon} />
          Quotes
        </button>

        <button
          className={`${styles.navItem} ${activeTab === 'documents' ? styles.active : ''}`}
          onClick={() => onTabChange('documents')}
        >
          <img src="/assets/icons/document.svg" alt="" width="16" height="16" className={styles.navIcon} />
          Documents
        </button>
      </nav>
    </div>
  )
}
