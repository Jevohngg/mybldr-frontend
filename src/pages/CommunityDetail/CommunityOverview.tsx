import React from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../../app/providers'
import Button from '../../components/ui/Button'
import PlanCard from '../../components/cards/PlanCard/PlanCard'
import CommunityMap from '../../components/map/CommunityMap/CommunityMap'
import AddPlansModal from '../../components/modals/AddPlansModal/AddPlansModal'
import { useCommunityMapData } from '../../components/map'
import styles from './CommunityOverview.module.css'

type ViewMode = 'cards' | 'list' | 'grid'

export default function CommunityOverview() {
  const { communityId } = useParams()
  const { communities, plans } = useData()

  const community = communities.find((c) => c.id === communityId) || communities[0]

  const [addPlansOpen, setAddPlansOpen] = React.useState(false)
  const [selectedPlans, setSelectedPlans] = React.useState<string[]>([...community.planIds])
  const [viewMode, setViewMode] = React.useState<ViewMode>('cards')

  const { mapData } = useCommunityMapData({
    communityId: community.id,
    communityName: community.name,
  })

  React.useEffect(() => {
    setSelectedPlans([...community.planIds])
  }, [community.id])

  const planObjs = plans.filter((p) => selectedPlans.includes(p.id))

  const statsTopRow = [
    { label: 'Sold', value: '120', icon: '/assets/icons/community.svg', active: true },
    { label: 'Released', value: '240', icon: '/assets/icons/document.svg', active: false },
    { label: 'Started', value: '20', icon: '/assets/icons/active-builds.svg', active: false },
    { label: 'Not Started', value: '220', icon: '/assets/icons/community-plans.svg', active: false },
    { label: 'Spec Homes', value: '2', icon: '/assets/icons/enviroment.svg', active: false },
  ] as const

  const statsBottomRow = [
    { label: 'Total Value', value: '2.3M', icon: '/assets/icons/total-value.svg', active: false },
    { label: 'Lots Available', value: '96', icon: '/assets/icons/lots-available.svg', active: false },
    { label: 'Occupancy Rate', value: '25%', icon: '/assets/icons/occupancy-rate.svg', active: false },
    { label: 'Active Builds', value: '96', icon: '/assets/icons/active-builds.svg', active: false },
  ] as const

  return (
    <div className={styles.page}>
      {/* Header row (title + primary actions) */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className="h1">{community.name}</div>
        </div>

        <div className={styles.headerRight}>
          <Button iconOnly aria-label="Community settings" className={styles.iconButton}>
            <img
              src="/assets/icons/sliders.svg"
              alt=""
              className={styles.iconButtonIcon}
              draggable={false}
            />
          </Button>

<Button
  variant="secondary"
  className={styles.salesKioskButton}
  onClick={() =>
    window.open(
      'https://homeselection.mybuild.wtsparadigm.com/communities/f737219e-e08e-4496-a609-a178a6632c1a/menu',
      '_blank'
    )
  }
>
  <span className={styles.buttonContent}>
    <span>Sales Kiosk</span>
    <img
      src="/assets/icons/arrow-right.svg"
      alt=""
      className={styles.buttonIcon}
      draggable={false}
    />
  </span>
</Button>


          <Button
            variant="primary"
            className={styles.addNewButton}
            onClick={() => setAddPlansOpen(true)}
          >
            <span className={styles.buttonContent}>
              <img
                src="/assets/icons/plus.svg"
                alt=""
                className={styles.buttonIcon}
                draggable={false}
              />
              <span>Add New</span>
              <img
                src="/assets/icons/chevron-down-white.svg"
                alt=""
                className={styles.buttonIcon}
                draggable={false}
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Sub header row (showing + filters/sort/view toggles) */}
      <div className={styles.subheaderRow}>
        <div className={styles.subtitle}>
          <span className={styles.subtitleLabel}>Showing:</span>

          <button
            type="button"
            className={styles.showingDropdown}
            aria-label="Showing: Active Projects"
          >
            <span>Active Projects</span>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              className={styles.dropdownChevron}
              draggable={false}
            />
          </button>
        </div>

        <div className={styles.controlsRow}>
          <button type="button" className={styles.controlButton}>
            <span className={styles.controlButtonContent}>
              <img
                src="/assets/icons/filter.svg"
                alt=""
                className={styles.controlIcon}
                draggable={false}
              />
              <span>Filter</span>
            </span>
          </button>

          <button type="button" className={styles.controlButton}>
            <span className={styles.controlButtonContent}>
              <img
                src="/assets/icons/sort.svg"
                alt=""
                className={styles.controlIcon}
                draggable={false}
              />
              <span>Sort</span>
            </span>
          </button>

          <div className={styles.viewToggleGroup} role="group" aria-label="View mode">
            <button
              type="button"
              className={`${styles.viewToggleButton} ${
                viewMode === 'cards' ? styles.viewToggleActive : ''
              }`}
              aria-label="Card view"
              onClick={() => setViewMode('cards')}
            >
              <img
                src="/assets/icons/view-image.svg"
                alt=""
                className={styles.viewToggleIcon}
                draggable={false}
              />
            </button>

            <button
              type="button"
              className={`${styles.viewToggleButton} ${
                viewMode === 'list' ? styles.viewToggleActive : ''
              }`}
              aria-label="List view"
              onClick={() => setViewMode('list')}
            >
              <img
                src="/assets/icons/view-list.svg"
                alt=""
                className={styles.viewToggleIcon}
                draggable={false}
              />
            </button>

            <button
              type="button"
              className={`${styles.viewToggleButton} ${
                viewMode === 'grid' ? styles.viewToggleActive : ''
              }`}
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
            >
              <img
                src="/assets/icons/view-grid.svg"
                alt=""
                className={styles.viewToggleIcon}
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {planObjs.length > 0 && (
        <>
          <div className={styles.statsRowTop}>
            {statsTopRow.map((s) => (
              <div key={s.label} className={`${styles.stat} ${s.active ? styles.statActive : ''}`}>
                <div className={styles.statInner}>
                  <div className={styles.statIconWrap}>
                    <img src={s.icon} alt="" className={styles.statIcon} draggable={false} />
                  </div>

                  <div className={styles.statText}>
                    <div className={styles.statTop}>{s.label}</div>
                    <div className={styles.statValue}>{s.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.statsRowBottom}>
            {statsBottomRow.map((s) => (
              <div key={s.label} className={`${styles.stat} ${s.active ? styles.statActive : ''}`}>
                <div className={styles.statInner}>
                  <div className={styles.statIconWrap}>
                    <img src={s.icon} alt="" className={styles.statIcon} draggable={false} />
                  </div>

                  <div className={styles.statText}>
                    <div className={styles.statTop}>{s.label}</div>
                    <div className={styles.statValue}>{s.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Master plans */}
      <div className={styles.sectionRow}>
        <div className={styles.sectionTitle}>
          MASTER PLANS <span className={styles.dot}>•</span>{' '}
          <span className={styles.small}>{planObjs.length} PLANS</span>
        </div>
      </div>

      {planObjs.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyBox}>
            {/* Illustration stack */}
            <div className={styles.emptyArt} aria-hidden="true">
  <img
    src="/assets/empty-state-image.png"
    alt=""
    className={styles.emptyArtImg}
    draggable={false}
  />
</div>


            <div className={styles.emptyTitle}>No plans added to this community</div>
            <div className={styles.emptySub}>Add plans to this community to start planning</div>

            <Button
              variant="primary"
              onClick={() => setAddPlansOpen(true)}
              className={styles.emptyPrimaryBtn}
            >
              <span className={styles.emptyBtnContent}>
                <img
                  src="/assets/icons/plus.svg"
                  alt=""
                  className={styles.emptyBtnIcon}
                  draggable={false}
                />
                <span>Add Plans</span>
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.plansRow}>
            {planObjs.slice(0, 4).map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>

          <div className={styles.viewAllRow}>
            <button type="button" className={styles.viewAllButton}>
              View All
            </button>
          </div>
        </>
      )}

      {/* Community map */}
      <div className={styles.sectionRow2}>
        <div className={styles.sectionTitle}>
          COMMUNITY MAP <span className={styles.dot}>•</span>{' '}
          <span className={styles.small}>{community.mapProjects || 0} ACTIVE PROJECTS</span>
        </div>
      </div>

      <div className={styles.mapWrap}>
        <CommunityMap data={mapData} />
      </div>

      <AddPlansModal
        open={addPlansOpen}
        onClose={() => setAddPlansOpen(false)}
        onDone={(sel) => {
          setSelectedPlans(sel)
          setAddPlansOpen(false)
        }}
        initialSelected={selectedPlans}
      />
    </div>
  )
}
