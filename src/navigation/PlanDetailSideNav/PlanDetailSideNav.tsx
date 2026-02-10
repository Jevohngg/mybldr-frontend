import layout from '../../components/shared/DetailPageLayout/DetailPageLayout.module.css'

type TabType = 'overview' | 'plans'

interface PlanDetailSideNavProps {
  planName: string
  communityCount: number
  communityName?: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function PlanDetailSideNav({ planName, communityCount, communityName, activeTab, onTabChange }: PlanDetailSideNavProps) {
  const shortPlanName = planName.replace(/^The\s+/i, '')

  const subtitle = communityName
    ? `${communityName} · ${shortPlanName}`
    : `${communityCount} Communities`

  return (
    <div className={layout.sidebar}>
      <div className={layout.sidebarHeader}>
        <div className={layout.entityIcon}>
          <img src="/assets/icons/plan-detail-header.svg" alt="" width="20" height="20" />
        </div>
        <div className={layout.headerInfo}>
          <div className={layout.entityName}>{planName}</div>
          <div className={layout.entitySubtitle}>{subtitle}</div>
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
          className={`${layout.navItem} ${activeTab === 'plans' ? layout.active : ''}`}
          onClick={() => onTabChange('plans')}
        >
          <img src="/assets/icons/document.svg" alt="" width="16" height="16" className={layout.navIcon} />
          Documents
        </button>
      </nav>
    </div>
  )
}
