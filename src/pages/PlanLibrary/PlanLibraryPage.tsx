import React from 'react'
import Button from '../../components/ui/Button'
import PlanCard from '../../components/cards/PlanCard/PlanCard'
import PlanDetailModal from '../../components/modals/PlanDetailModal/PlanDetailModal'
import { useData } from '../../app/providers'
import styles from './PlanLibraryPage.module.css'

export default function PlanLibraryPage() {
  const { plans } = useData()
  const [selectedPlan, setSelectedPlan] = React.useState<{ id: string; name: string; communityCount: number } | null>(null)
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = React.useState(false)

  // Listen for closeAllModals event (dispatched when navigating from search)
  React.useEffect(() => {
    const handleCloseModals = () => {
      setSelectedPlan(null)
      setIsNewPlanModalOpen(false)
    }
    window.addEventListener('closeAllModals', handleCloseModals)
    return () => window.removeEventListener('closeAllModals', handleCloseModals)
  }, [])

  return (
    <div className={styles.page}>
      <div className="pageTitleRow">
        <div className="h1">Plan Library</div>
        <Button variant="primary" onClick={() => setIsNewPlanModalOpen(true)}>
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
          <PlanCard
            key={p.id}
            plan={p}
            onClick={() => setSelectedPlan({
              id: (p as any).id,
              name: p.name,
              communityCount: (p as any).communityCount || 0
            })}
          />
        ))}
      </div>

      <PlanDetailModal
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan?.id || ''}
        planName={selectedPlan?.name || ''}
        communityCount={selectedPlan?.communityCount || 0}
      />

      <PlanDetailModal
        open={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        planId=""
        planName="New Plan"
        communityCount={0}
        isNewPlan
      />
    </div>
  )
}
