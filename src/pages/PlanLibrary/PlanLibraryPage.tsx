import React from 'react'
import Button from '../../components/ui/Button'
import PlanCard from '../../components/cards/PlanCard/PlanCard'
import PlanDetailModal from '../../components/modals/PlanDetailModal/PlanDetailModal'
import BedsAndBathsDropdown, { BedsAndBathsFilters } from '../../components/filters/BedsAndBathsDropdown/BedsAndBathsDropdown'
import WidthAndDepthDropdown, { WidthAndDepthFilters } from '../../components/filters/WidthAndDepthDropdown/WidthAndDepthDropdown'
import SquareFootageDropdown, { SquareFootageFilters } from '../../components/filters/SquareFootageDropdown/SquareFootageDropdown'
import CategoriesDropdown, { CategoriesFilters } from '../../components/filters/CategoriesDropdown/CategoriesDropdown'
import { useData } from '../../app/providers'
import styles from './PlanLibraryPage.module.css'

export default function PlanLibraryPage() {
  const { plans } = useData()
  const [selectedPlan, setSelectedPlan] = React.useState<{ id: string; name: string; communityCount: number } | null>(null)
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = React.useState(false)
  const [isBedsAndBathsOpen, setIsBedsAndBathsOpen] = React.useState(false)
  const [isWidthAndDepthOpen, setIsWidthAndDepthOpen] = React.useState(false)
  const [isSquareFootageOpen, setIsSquareFootageOpen] = React.useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false)
  const [isAlertClosing, setIsAlertClosing] = React.useState(false)
  const [bedsAndBathsFilters, setBedsAndBathsFilters] = React.useState<BedsAndBathsFilters>({
    bedrooms: 'Any',
    bathrooms: 'Any',
    halfBaths: 'Any'
  })
  const [widthAndDepthFilters, setWidthAndDepthFilters] = React.useState<WidthAndDepthFilters>({
    widthMin: '',
    widthMax: '',
    depthMin: '',
    depthMax: ''
  })
  const [squareFootageFilters, setSquareFootageFilters] = React.useState<SquareFootageFilters>({
    min: '',
    max: ''
  })
  const [categoriesFilters, setCategoriesFilters] = React.useState<CategoriesFilters>({
    selectedCategories: []
  })

  // Listen for closeAllModals event (dispatched when navigating from search)
  React.useEffect(() => {
    const handleCloseModals = () => {
      setSelectedPlan(null)
      setIsNewPlanModalOpen(false)
      setIsBedsAndBathsOpen(false)
      setIsWidthAndDepthOpen(false)
      setIsSquareFootageOpen(false)
      setIsCategoriesOpen(false)
    }
    window.addEventListener('closeAllModals', handleCloseModals)
    return () => window.removeEventListener('closeAllModals', handleCloseModals)
  }, [])

  // Calculate active plans count for badge
  const activePlansCount = plans.filter(p => (p as any).status !== 'inactive' && (p as any).status !== 'archived').length || plans.length

  // Count active beds and baths filters
  const bedsAndBathsFilterCount = [
    bedsAndBathsFilters.bedrooms !== 'Any',
    bedsAndBathsFilters.bathrooms !== 'Any',
    bedsAndBathsFilters.halfBaths !== 'Any'
  ].filter(Boolean).length

  // Count active width and depth filters
  const widthAndDepthFilterCount = [
    widthAndDepthFilters.widthMin !== '',
    widthAndDepthFilters.widthMax !== '',
    widthAndDepthFilters.depthMin !== '',
    widthAndDepthFilters.depthMax !== ''
  ].filter(Boolean).length

  // Count active square footage filters
  const squareFootageFilterCount = [
    squareFootageFilters.min !== '',
    squareFootageFilters.max !== ''
  ].filter(Boolean).length

  // Count active categories filters
  const categoriesFilterCount = categoriesFilters.selectedCategories.length

  // Check if any filter is applied
  const hasAnyFilter = bedsAndBathsFilterCount > 0 || widthAndDepthFilterCount > 0 || squareFootageFilterCount > 0 || categoriesFilterCount > 0

  const handleBedsAndBathsApply = (filters: BedsAndBathsFilters) => {
    setBedsAndBathsFilters(filters)
  }

  const handleWidthAndDepthApply = (filters: WidthAndDepthFilters) => {
    setWidthAndDepthFilters(filters)
  }

  const handleSquareFootageApply = (filters: SquareFootageFilters) => {
    setSquareFootageFilters(filters)
  }

  const handleCategoriesApply = (filters: CategoriesFilters) => {
    setCategoriesFilters(filters)
  }

  const handleClearAllFilters = () => {
    setBedsAndBathsFilters({
      bedrooms: 'Any',
      bathrooms: 'Any',
      halfBaths: 'Any'
    })
    setWidthAndDepthFilters({
      widthMin: '',
      widthMax: '',
      depthMin: '',
      depthMax: ''
    })
    setSquareFootageFilters({
      min: '',
      max: ''
    })
    setCategoriesFilters({
      selectedCategories: []
    })
  }

  const handleCloseAlert = () => {
    setIsAlertClosing(true)
    // Element stays collapsed at 0 height - no display:none to avoid jump
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.alertWrapper} ${isAlertClosing ? styles.alertWrapperClosing : ''}`}>
        <div className={`${styles.alertBanner} ${isAlertClosing ? styles.alertClosing : ''}`}>
          <div className={styles.alertContent}>
            <span className={styles.alertText}>
              Welcome to your Product Library. We've grouped all the plans you've submitted to BFS under a single Plan Name, so you can find what you need fast without digging through folders.
            </span>
          </div>
          <button
            className={styles.alertCloseButton}
            onClick={handleCloseAlert}
            aria-label="Dismiss alert"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="pageTitleRow">
        <div className="h1">Product Library</div>
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
        <div className={styles.leftFilters}>
          <button className={styles.filterButton}>
            <span className={styles.filterBadge}>{activePlansCount}</span>
            <span>Active</span>
            <img
              src="/assets/icons/chevron-down.svg"
              alt=""
              className={styles.filterChevron}
              draggable={false}
            />
          </button>
        </div>

        <div className={styles.rightFilters}>
          {hasAnyFilter && (
            <button
              className={styles.clearFiltersButton}
              onClick={handleClearAllFilters}
            >
              Clear filters
            </button>
          )}
          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterButton} ${isBedsAndBathsOpen ? styles.filterButtonActive : ''}`}
              onClick={() => setIsBedsAndBathsOpen(!isBedsAndBathsOpen)}
            >
              {bedsAndBathsFilterCount > 0 && (
                <span className={styles.filterCountBadge}>{bedsAndBathsFilterCount}</span>
              )}
              <span>Beds & baths</span>
              <img
                src="/assets/icons/chevron-down.svg"
                alt=""
                className={styles.filterChevron}
                draggable={false}
              />
            </button>
            <BedsAndBathsDropdown
              isOpen={isBedsAndBathsOpen}
              onClose={() => setIsBedsAndBathsOpen(false)}
              onApply={handleBedsAndBathsApply}
              initialFilters={bedsAndBathsFilters}
            />
          </div>
          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterButton} ${isWidthAndDepthOpen ? styles.filterButtonActive : ''}`}
              onClick={() => setIsWidthAndDepthOpen(!isWidthAndDepthOpen)}
            >
              {widthAndDepthFilterCount > 0 && (
                <span className={styles.filterCountBadge}>{widthAndDepthFilterCount}</span>
              )}
              <span>Width & Depth</span>
              <img
                src="/assets/icons/chevron-down.svg"
                alt=""
                className={styles.filterChevron}
                draggable={false}
              />
            </button>
            <WidthAndDepthDropdown
              isOpen={isWidthAndDepthOpen}
              onClose={() => setIsWidthAndDepthOpen(false)}
              onApply={handleWidthAndDepthApply}
              initialFilters={widthAndDepthFilters}
            />
          </div>
          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterButton} ${isSquareFootageOpen ? styles.filterButtonActive : ''}`}
              onClick={() => setIsSquareFootageOpen(!isSquareFootageOpen)}
            >
              {squareFootageFilterCount > 0 && (
                <span className={styles.filterCountBadge}>{squareFootageFilterCount}</span>
              )}
              <span>Square Footage</span>
              <img
                src="/assets/icons/chevron-down.svg"
                alt=""
                className={styles.filterChevron}
                draggable={false}
              />
            </button>
            <SquareFootageDropdown
              isOpen={isSquareFootageOpen}
              onClose={() => setIsSquareFootageOpen(false)}
              onApply={handleSquareFootageApply}
              initialFilters={squareFootageFilters}
            />
          </div>
          <div className={styles.filterButtonWrapper}>
            <button
              className={`${styles.filterButton} ${isCategoriesOpen ? styles.filterButtonActive : ''}`}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              {categoriesFilterCount > 0 && (
                <span className={styles.filterCountBadge}>{categoriesFilterCount}</span>
              )}
              <span>Categories</span>
              <img
                src="/assets/icons/chevron-down.svg"
                alt=""
                className={styles.filterChevron}
                draggable={false}
              />
            </button>
            <CategoriesDropdown
              isOpen={isCategoriesOpen}
              onClose={() => setIsCategoriesOpen(false)}
              onApply={handleCategoriesApply}
              initialFilters={categoriesFilters}
            />
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
