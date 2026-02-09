import layout from '../../components/shared/DetailPageLayout/DetailPageLayout.module.css'

type TabType = 'overview' | 'quotes' | 'documents'

interface LotConfigSideNavProps {
  lotNumber: string
  communityName: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function LotConfigSideNav({ lotNumber, communityName, activeTab, onTabChange }: LotConfigSideNavProps) {
  return (
    <div className={layout.sidebar}>
      <div className={layout.sidebarHeader}>
        <div className={layout.entityIcon}>
          <img src="/assets/icons/community.svg" alt="" width="20" height="20" />
        </div>
        <div className={layout.headerInfo}>
          <div className={layout.entityName}>Lot {lotNumber}</div>
          <div className={layout.entitySubtitle}>{communityName}</div>
        </div>
      </div>

      <nav className={layout.navList}>
        <button
          className={`${layout.navItem} ${activeTab === 'overview' ? layout.active : ''}`}
          onClick={() => onTabChange('overview')}
        >
          <img src="/assets/icons/overview.svg" alt="" width="16" height="16" className={layout.navIcon} />
          Overview
        </button>
        <button
          className={`${layout.navItem} ${activeTab === 'quotes' ? layout.active : ''}`}
          onClick={() => onTabChange('quotes')}
        >
          <img src="/assets/icons/quotes.svg" alt="" width="16" height="16" className={layout.navIcon} />
          Quotes
        </button>
        <button
          className={`${layout.navItem} ${activeTab === 'documents' ? layout.active : ''}`}
          onClick={() => onTabChange('documents')}
        >
          <img src="/assets/icons/document.svg" alt="" width="16" height="16" className={layout.navIcon} />
          Documents
        </button>
      </nav>
    </div>
  )
}
