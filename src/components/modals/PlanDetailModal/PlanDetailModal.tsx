import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import styles from './PlanDetailModal.module.css'
import PlanDetailSideNav from '../../../navigation/PlanDetailSideNav/PlanDetailSideNav'
import AIPreviewOverlay from '../../ai-preview/AIPreviewOverlay'
import RecordInfo from './RecordInfo'
import PlanFeatures from './PlanFeatures'
import HomeBuyerContent from './HomeBuyerContent'
import Button from '../../ui/Button'
import { getPlanById } from '../../../mock-data/plans'

type TabType = 'overview' | 'plans'

interface PlanDetailModalProps {
  open: boolean
  onClose: () => void
  planId: string
  planName: string
  communityCount: number
  isNewPlan?: boolean
}

export default function PlanDetailModal({ open, onClose, planId, planName, communityCount, isNewPlan = false }: PlanDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')
  const [aiPreviewOpen, setAiPreviewOpen] = React.useState(false)
  // Lifted extraction state for sidebar components
  const [isExtractingData, setIsExtractingData] = React.useState(false)
  const [dataPopulated, setDataPopulated] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: planName,
    modelId: '',
    masterModelId: '',
    collection: [] as string[],
    series: [] as string[],
    structureType: [] as string[],
    specificationLevel: [] as string[],
    division: [] as string[],
    description: '',
    bedrooms: 0,
    bathrooms: 0,
    halfBaths: 0,
    garageSpaces: 0,
    totalFinishedSqft: 0,
    totalUnfinishedSqft: 0,
    width: "0'",
    depth: "0'",
    numberOfElevations: 0,
    foundationTypes: [] as string[],
    costPerSquareFoot: 0,
    floors: 0,
    // Team info
    architectOfRecord: '',
    engineerOfRecord: '',
    copyrightOwner: '',
    // Plan features
    planFeatures: [] as string[],
  })

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  React.useEffect(() => {
    if (open) {
      if (isNewPlan) {
        // Initialize with completely blank/empty data for new plans
        setFormData({
          name: '',
          modelId: '',
          masterModelId: '',
          collection: [],
          series: [],
          structureType: [],
          specificationLevel: [],
          division: [],
          description: '',
          bedrooms: 0,
          bathrooms: 0,
          halfBaths: 0,
          garageSpaces: 0,
          totalFinishedSqft: 0,
          totalUnfinishedSqft: 0,
          width: '',
          depth: '',
          numberOfElevations: 0,
          foundationTypes: [],
          costPerSquareFoot: 0,
          floors: 0,
          architectOfRecord: '',
          engineerOfRecord: '',
          copyrightOwner: '',
          planFeatures: [],
        })
      } else {
        // Load plan data from mock data
        const planData = getPlanById(planId)
        if (planData) {
          setFormData({
            name: planData.name,
            modelId: planData.modelId,
            masterModelId: planData.masterModelId,
            collection: planData.collection,
            series: planData.seriesList,
            structureType: planData.structureType,
            specificationLevel: planData.specificationLevel,
            division: planData.division,
            description: planData.description,
            bedrooms: planData.bedrooms,
            bathrooms: planData.bathrooms,
            halfBaths: planData.halfBaths,
            garageSpaces: planData.garageSpaces,
            totalFinishedSqft: planData.totalFinishedSqft,
            totalUnfinishedSqft: planData.totalUnfinishedSqft,
            width: planData.width,
            depth: planData.depth,
            numberOfElevations: planData.numberOfElevations,
            foundationTypes: planData.foundationTypes,
            costPerSquareFoot: planData.costPerSquareFoot,
            floors: planData.floors,
            architectOfRecord: planData.architectOfRecord,
            engineerOfRecord: planData.engineerOfRecord,
            copyrightOwner: planData.copyrightOwner,
            planFeatures: planData.planFeatures,
          })
        } else {
          // Fallback for plans not in mock data
          setFormData({
            name: planName,
            modelId: '',
            masterModelId: '',
            collection: ['River Collection'],
            series: ["30' Series", "50' Series"],
            structureType: ['Single Family', 'Villa'],
            specificationLevel: ['Live.M'],
            division: ['DFW', 'Houston'],
            description: '',
            bedrooms: 0,
            bathrooms: 0,
            halfBaths: 0,
            garageSpaces: 0,
            totalFinishedSqft: 0,
            totalUnfinishedSqft: 0,
            width: "0'",
            depth: "0'",
            numberOfElevations: 0,
            foundationTypes: ['Slab on Grade', 'Piles'],
            costPerSquareFoot: 0,
            floors: 0,
            architectOfRecord: '',
            engineerOfRecord: '',
            copyrightOwner: '',
            planFeatures: [],
          })
        }
      }
      setActiveTab('overview')
    }
  }, [open, planId, planName, isNewPlan])

  return (
    <>
      <AIPreviewOverlay open={aiPreviewOpen} onClose={() => setAiPreviewOpen(false)} />
      <AnimatePresence mode="wait">
        {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.backdrop} onClick={onClose} />
          <motion.div
            className={styles.panel}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <Button variant="ghost" size="sm" iconOnly className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</Button>
            <div className={styles.container}>
              <PlanDetailSideNav
                planName={formData.name || planName}
                communityCount={communityCount}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className={styles.mainContent}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{activeTab === 'overview' ? 'Overview' : 'Plans'}</h1>
                </div>

                <div className={styles.scrollableWrapper}>
                  <div className={styles.centerContent}>
                    {activeTab === 'overview' && (
                      <OverviewTab
                        formData={formData}
                        setFormData={setFormData}
                        onOpenAIPreview={() => setAiPreviewOpen(true)}
                        isNewPlan={isNewPlan}
                        isExtractingData={isExtractingData}
                        setIsExtractingData={setIsExtractingData}
                        dataPopulated={dataPopulated}
                        setDataPopulated={setDataPopulated}
                      />
                    )}
                    {activeTab === 'plans' && (
                      <PlansTab />
                    )}
                  </div>

                  {activeTab === 'overview' && (
                    <div className={styles.rightSidebar}>
                      <HomeBuyerContent isNewPlan={isNewPlan} />
                      <PlanFeatures
                        features={formData.planFeatures}
                        isLoading={isExtractingData}
                        isPopulated={dataPopulated}
                      />
                      <RecordInfo
                        architectOfRecord={formData.architectOfRecord}
                        engineerOfRecord={formData.engineerOfRecord}
                        copyrightOwner={formData.copyrightOwner}
                        onArchitectChange={(value) => setFormData(prev => ({ ...prev, architectOfRecord: value }))}
                        onEngineerChange={(value) => setFormData(prev => ({ ...prev, engineerOfRecord: value }))}
                        onCopyrightChange={(value) => setFormData(prev => ({ ...prev, copyrightOwner: value }))}
                        isLoading={isExtractingData}
                        isPopulated={dataPopulated}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// The Smith Plan data for auto-population
const SMITH_PLAN_DATA = {
  name: 'The Smith',
  modelId: 'SM-2024-031',
  masterModelId: 'SM-MASTER-003',
  collection: ['Accessibility Collection'],
  series: ["50' Series"],
  structureType: ['Single Family'],
  specificationLevel: ['Standard'],
  division: ['DFW'],
  description: 'Single-level home with wide halls and zero-step entry. Designed for accessibility with an open floor plan, 3 bedrooms, and 2 full bathrooms. Energy-efficient construction with LEED Gold certification.',
  bedrooms: 3,
  bathrooms: 2,
  halfBaths: 1,
  garageSpaces: 2,
  totalFinishedSqft: 2850,
  totalUnfinishedSqft: 850,
  width: "50'",
  depth: "60'",
  numberOfElevations: 4,
  foundationTypes: ['Slab'],
  costPerSquareFoot: 175,
  floors: 1,
  architectOfRecord: 'Smith Architecture',
  engineerOfRecord: 'Johnson Engineering',
  copyrightOwner: 'Smith Architecture',
  planFeatures: ['Office/Flex Space', 'Kitchen island', 'Fireplace'],
}

function OverviewTab({ formData, setFormData, onOpenAIPreview, isNewPlan = false, isExtractingData, setIsExtractingData, dataPopulated, setDataPopulated }: {
  formData: {
    name: string
    modelId: string
    masterModelId: string
    collection: string[]
    series: string[]
    structureType: string[]
    specificationLevel: string[]
    division: string[]
    description: string
    bedrooms: number
    bathrooms: number
    halfBaths: number
    garageSpaces: number
    totalFinishedSqft: number
    totalUnfinishedSqft: number
    width: string
    depth: string
    numberOfElevations: number
    foundationTypes: string[]
    costPerSquareFoot: number
    floors: number
    architectOfRecord: string
    engineerOfRecord: string
    copyrightOwner: string
    planFeatures: string[]
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    modelId: string
    masterModelId: string
    collection: string[]
    series: string[]
    structureType: string[]
    specificationLevel: string[]
    division: string[]
    description: string
    bedrooms: number
    bathrooms: number
    halfBaths: number
    garageSpaces: number
    totalFinishedSqft: number
    totalUnfinishedSqft: number
    width: string
    depth: string
    numberOfElevations: number
    foundationTypes: string[]
    costPerSquareFoot: number
    floors: number
    architectOfRecord: string
    engineerOfRecord: string
    copyrightOwner: string
    planFeatures: string[]
  }>>
  onOpenAIPreview: () => void
  isNewPlan?: boolean
  isExtractingData: boolean
  setIsExtractingData: React.Dispatch<React.SetStateAction<boolean>>
  dataPopulated: boolean
  setDataPopulated: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [isPreparing, setIsPreparing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [allDetailsExpanded, setAllDetailsExpanded] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleUpload = () => {
    setIsPreparing(true)
    setIsCompleted(false)
    setProgress(0)

    // Start extraction when upload starts (for new plans only)
    if (isNewPlan) {
      setIsExtractingData(true)
      setDataPopulated(false)
    }

    setTimeout(() => {
      if (containerRef.current) {
        const element = containerRef.current
        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const middle = absoluteElementTop - 100
        const scrollableParent = element.closest(`.${styles.content}`)
        if (scrollableParent) {
          scrollableParent.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' })
        }
      }
    }, 50)

    setTimeout(() => {
      setIsPreparing(false)
      setIsUploading(true)

      const duration = 3000
      const interval = 20
      const steps = duration / interval
      const increment = 100 / steps

      let currentProgress = 0
      const timer = setInterval(() => {
        currentProgress += increment
        if (currentProgress >= 100) {
          setProgress(100)
          clearInterval(timer)
          setTimeout(() => {
            setIsUploading(false)
            setIsCompleted(true)

            // Keep spinners for 1 more second after completion, then populate data
            if (isNewPlan) {
              setTimeout(() => {
                setIsExtractingData(false)
                setFormData(SMITH_PLAN_DATA)
                setDataPopulated(true)
                // Reset populated animation state after animation completes
                setTimeout(() => setDataPopulated(false), 500)
              }, 1000)
            }
          }, 300)
        } else {
          setProgress(currentProgress)
        }
      }, interval)
    }, 600)
  }

  const handleCancel = () => {
    setIsPreparing(false)
    setIsUploading(false)
    setIsCompleted(false)
    setProgress(0)
  }

  const handleClear = () => {
    setIsCompleted(false)
    setProgress(0)
  }

  const handleRemoveTag = (field: keyof typeof formData, value: string) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter(item => item !== value)
      }))
    }
  }

  // Helper component for field spinner
  const FieldSpinner = ({ isTextarea = false }: { isTextarea?: boolean }) => (
    <div className={`${styles.fieldSpinner} ${isTextarea ? styles.fieldSpinnerTextarea : ''}`}>
      <svg className={styles.fieldSpinnerSvg} viewBox="0 0 50 50">
        <circle className={styles.fieldSpinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
      </svg>
    </div>
  )

  // Helper to get input class names
  const getInputClassName = (baseClass: string = styles.input) => {
    const classes = [baseClass]
    if (isExtractingData) classes.push(styles.inputLoading)
    if (dataPopulated) classes.push(styles.inputPopulated)
    return classes.join(' ')
  }

  return (
    <div className={styles.overviewTab}>
      <div className={styles.sectionCard}>
        <div className={styles.formSection}>
          <label className={styles.label}>Name</label>
          <div className={styles.inputWrapper}>
            {isExtractingData && <FieldSpinner />}
            <input
              type="text"
              className={getInputClassName()}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isExtractingData}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Model ID</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="text"
                className={getInputClassName()}
                placeholder="Enter model id number"
                value={formData.modelId}
                onChange={(e) => setFormData(prev => ({ ...prev, modelId: e.target.value }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Master model ID</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="text"
                className={getInputClassName()}
                placeholder="Enter master model ID"
                value={formData.masterModelId}
                onChange={(e) => setFormData(prev => ({ ...prev, masterModelId: e.target.value }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Collection</label>
            <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
              {isExtractingData && <FieldSpinner />}
              <div className={styles.multiSelectContent}>
                {formData.collection.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('collection', item)}
                      disabled={isExtractingData}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>
              <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Series</label>
            <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
              {isExtractingData && <FieldSpinner />}
              <div className={styles.multiSelectContent}>
                {formData.series.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('series', item)}
                      disabled={isExtractingData}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>
              <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Structure Type</label>
            <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
              {isExtractingData && <FieldSpinner />}
              <div className={styles.multiSelectContent}>
                {formData.structureType.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('structureType', item)}
                      disabled={isExtractingData}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>
              <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Specification Level</label>
            <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
              {isExtractingData && <FieldSpinner />}
              <div className={styles.multiSelectContent}>
                {formData.specificationLevel.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('specificationLevel', item)}
                      disabled={isExtractingData}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>
              <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Division</label>
          <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
            {isExtractingData && <FieldSpinner />}
            <div className={styles.multiSelectContent}>
              {formData.division.map(item => (
                <span key={item} className={styles.tag}>
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    iconOnly
                    className={styles.tagRemove}
                    onClick={() => handleRemoveTag('division', item)}
                    disabled={isExtractingData}
                  >
                    ✕
                  </Button>
                </span>
              ))}
            </div>
            <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Description</label>
          <div className={styles.inputWrapper}>
            {isExtractingData && <FieldSpinner isTextarea />}
            <textarea
              className={getInputClassName(styles.textarea)}
              placeholder="Enter plan description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={5}
              disabled={isExtractingData}
            />
          </div>
        </div>

        <div className={styles.masterPlanSection}>
          <h2 className={styles.sectionTitle}>{isNewPlan ? 'Master Plan Set' : 'Plan Set'}</h2>
          <div className={styles.masterPlanContainer} ref={containerRef}>
            {isNewPlan ? (
              // New plan: show upload flow
              <>
                {!isPreparing && !isUploading && !isCompleted ? (
                  <div className={styles.emptyState}>
                    <img src="/assets/empty-states/master-plan-set.svg" alt="" className={styles.emptyIcon} />
                    <div className={styles.emptyTitle}>Master plan set not selected</div>
                    <div className={styles.emptyDescription}>
                      Speed up takeoffs, get bids faster, and preview a render of your plan set.
                    </div>
                    <Button variant="primary" size="small" className={styles.uploadBtn} onClick={handleUpload}>
                      <img src="/assets/icons/plus.svg" alt="" width="16" height="16" />
                      Upload File
                    </Button>
                  </div>
                ) : isPreparing ? (
                  <div className={styles.preparingState}>
                    <div className={styles.spinner}>
                      <svg className={styles.spinnerSvg} viewBox="0 0 50 50">
                        <circle className={styles.spinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                      </svg>
                    </div>
                    <div className={styles.preparingText}>Preparing upload...</div>
                  </div>
                ) : isUploading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.imageSection}>
                      <img src="/assets/plans/placeholder.png" alt="" className={styles.backgroundImage} />
                    </div>
                    <div className={styles.loadingSection}>
                      <h3 className={styles.loadingTitle}>Loading Visualizer</h3>
                      <div className={styles.loadingText}>Analyzing project...</div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileDetails}>
                        <img src="/assets/pdf.png" alt="" className={styles.pdfIcon} />
                        <div className={styles.fileText}>
                          <div className={styles.fileName}>master_plan_name.pdf</div>
                          <div className={styles.fileSize}>100kb</div>
                        </div>
                      </div>
                      <div className={styles.fileActions}>
                        <Button variant="secondary" size="small">Update</Button>
                        <Button variant="ghost" size="sm" iconOnly onClick={handleCancel} aria-label="Cancel">✕</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.completedState}>
                    <div className={styles.visualizerSection}>
                      <div className={styles.visualizerImage}>
                        <img src="/assets/plans/placeholder.png" alt="" />
                      </div>
                      <div className={styles.visualizerInfo}>
                        <h3 className={styles.visualizerTitle}>Visualizer</h3>
                        <p className={styles.visualizerDescription}>Step inside your AI-rendered home.</p>
                        <Button variant="secondary" size="small" className={styles.viewNowBtn} onClick={onOpenAIPreview}>View Now</Button>
                      </div>
                    </div>
                    <div className={styles.completedContent}>
                      <div className={styles.completedCard}>
                        <div className={styles.pdfHeader}>
                          <img src="/assets/pdf.png" alt="" className={styles.pdfIconLarge} />
                          <div className={styles.pdfInfo}>
                            <h4 className={styles.pdfTitle}>Master plan set selected</h4>
                            <div className={styles.pdfFilename}>master_plan_name.pdf</div>
                          </div>
                        </div>
                        <div className={styles.pdfActions}>
                          <Button variant="secondary" size="small">Update</Button>
                          <Button variant="link" onClick={handleClear}>Clear</Button>
                        </div>
                      </div>
                      <div className={styles.completedCard}>
                        <h4 className={styles.paletteTitle}>View with your palettes</h4>
                        <p className={styles.paletteDescription}>Preview your design by uploading your look book.</p>
                        <Button variant="secondary" size="small">
                          <img src="/assets/icons/upload.svg" alt="" width="16" height="16" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Existing plan: show Plan Set with Inspire card
              <div className={styles.existingPlanSet}>
                <div className={styles.inspireCard}>
                  <div className={styles.inspireImageArea}>
                    <img src="/assets/plans/placeholder.png" alt="" className={styles.inspireImage} />
                  </div>
                  <div className={styles.inspireContent}>
                    <div className={styles.inspireTextSection}>
                      <h3 className={styles.inspireTitle}>Inspire</h3>
                      <p className={styles.inspireDescription}>Visualize your build in 3D and explore different styles and options.</p>
                    </div>
                    <div className={styles.inspireButtons}>
                      <Button variant="secondary" onClick={() => window.open('/selections', '_blank')}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 2H14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.66666 9.33333L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        View now
                      </Button>
                      <Button variant="secondary">Share</Button>
                    </div>
                  </div>
                </div>
                <div className={styles.planSetFileRow}>
                  <div className={styles.planSetFileInfo}>
                    <img src="/assets/pdf.png" alt="" className={styles.planSetPdfIcon} />
                    <div className={styles.planSetFileText}>
                      <div className={styles.planSetFileName}>plan_name.pdf</div>
                      <div className={styles.planSetFileSize}>100kb</div>
                    </div>
                  </div>
                  <div className={styles.planSetButtonGroup}>
                    <Button variant="secondary">Update</Button>
                    <Button variant="ghost" size="sm" iconOnly aria-label="Remove file">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.baseHouseTitle}>Base house</h2>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Bedrooms</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.bedrooms || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Bathrooms</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.bathrooms || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Half baths</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.halfBaths || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, halfBaths: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Garage spaces</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.garageSpaces || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, garageSpaces: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Total finished square footage</label>
            <div className={styles.inputWithSuffix}>
              <div className={styles.inputWrapper}>
                {isExtractingData && <FieldSpinner />}
                <input
                  type="number"
                  className={getInputClassName()}
                  value={formData.totalFinishedSqft || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalFinishedSqft: Number(e.target.value) }))}
                  disabled={isExtractingData}
                />
              </div>
              <span className={styles.inputSuffix}>Sqft</span>
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Total unfinished square footage</label>
            <div className={styles.inputWithSuffix}>
              <div className={styles.inputWrapper}>
                {isExtractingData && <FieldSpinner />}
                <input
                  type="number"
                  className={getInputClassName()}
                  value={formData.totalUnfinishedSqft || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalUnfinishedSqft: Number(e.target.value) }))}
                  disabled={isExtractingData}
                />
              </div>
              <span className={styles.inputSuffix}>Sqft</span>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Width</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="text"
                className={getInputClassName()}
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Depth</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="text"
                className={getInputClassName()}
                value={formData.depth}
                onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}># of elevations</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.numberOfElevations || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfElevations: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Foundation types</label>
            <div className={`${styles.multiSelect} ${isExtractingData ? styles.inputLoading : ''} ${dataPopulated ? styles.inputPopulated : ''}`}>
              {isExtractingData && <FieldSpinner />}
              <div className={styles.multiSelectContent}>
                {formData.foundationTypes.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('foundationTypes', item)}
                      disabled={isExtractingData}
                    >
                      ✕
                    </Button>
                  </span>
                ))}
              </div>
              <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Cost per square foot</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.costPerSquareFoot || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, costPerSquareFoot: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Floors</label>
            <div className={styles.inputWrapper}>
              {isExtractingData && <FieldSpinner />}
              <input
                type="number"
                className={getInputClassName()}
                value={formData.floors || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, floors: Number(e.target.value) }))}
                disabled={isExtractingData}
              />
            </div>
          </div>
        </div>

        <div className={styles.allDetailsSection}>
          <Button
            variant="link"
            className={styles.allDetailsToggle}
            onClick={() => setAllDetailsExpanded(!allDetailsExpanded)}
          >
            <span className={styles.allDetailsLabel}>All Details</span>
            <svg
              className={`${styles.allDetailsChevron} ${allDetailsExpanded ? styles.expanded : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Community masters using this plan */}
      <div className={styles.sectionCard}>
        <h2 className={styles.plansCreatedTitle}>Community masters using {formData.name || 'this plan'}</h2>
        <div className={styles.plansTable}>
          <div className={styles.plansTableHeader}>
            <div className={styles.plansTableHeaderCell}>Name</div>
            <div className={styles.plansTableHeaderCell}>Beds</div>
            <div className={styles.plansTableHeaderCell}>Baths</div>
            <div className={styles.plansTableHeaderCell}>AUR</div>
            <div className={styles.plansTableHeaderCell}>Features</div>
          </div>
          <div className={styles.plansTableBody}>
            {isNewPlan ? (
              <div className={styles.plansTableEmptyRow}>
                <span className={styles.plansTableEmptyText}>No plans created yet</span>
              </div>
            ) : (
              <>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Serena</span>
                    <span className={styles.plansTableCommunity}>Silver Lake</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2.5</div>
                  <div className={styles.plansTableCell}>12</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Serena B</span>
                    <span className={styles.plansTableCommunity}>Whispering Hills</span>
                  </div>
                  <div className={styles.plansTableCell}>4</div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>8</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Finished LL</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Serena C</span>
                    <span className={styles.plansTableCommunity}>Riverside Estates</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2</div>
                  <div className={styles.plansTableCell}>15</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Deck</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Serena XL</span>
                    <span className={styles.plansTableCommunity}>The Pines</span>
                  </div>
                  <div className={styles.plansTableCell}>5</div>
                  <div className={styles.plansTableCell}>4</div>
                  <div className={styles.plansTableCell}>6</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                    <span className={styles.featureChip}>Deck</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Serena Plus</span>
                    <span className={styles.plansTableCommunity}>Silver Lake</span>
                  </div>
                  <div className={styles.plansTableCell}>4</div>
                  <div className={styles.plansTableCell}>3.5</div>
                  <div className={styles.plansTableCell}>10</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Finished LL</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {!isNewPlan && (
          <div className={styles.plansPagination}>
            <div className={styles.plansPaginationLeft}>
              <span className={styles.plansPaginationText}>Rows per page: 5</span>
              <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationDropdownIcon} />
            </div>
            <span className={styles.plansPaginationText}>1-5 of 13</span>
            <div className={styles.plansPaginationButtons}>
              <Button variant="secondary" iconOnly disabled aria-label="Previous page">‹</Button>
              <Button variant="secondary" iconOnly disabled aria-label="Next page">›</Button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.plansCreatedTitle}>Lot specific projects using {formData.name || 'this plan'}</h2>
        <div className={styles.plansTable}>
          <div className={styles.plansTableHeader}>
            <div className={styles.plansTableHeaderCell}>Project name</div>
            <div className={styles.plansTableHeaderCell}>Beds</div>
            <div className={styles.plansTableHeaderCell}>Baths</div>
            <div className={styles.plansTableHeaderCell}>Finished sq/ft</div>
            <div className={styles.plansTableHeaderCell}>Features</div>
          </div>
          <div className={styles.plansTableBody}>
            {isNewPlan ? (
              <div className={styles.plansTableEmptyRow}>
                <span className={styles.plansTableEmptyText}>No plans created yet</span>
              </div>
            ) : (
              <>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Lot 52</span>
                    <span className={styles.plansTableCommunity}>Whispering Hills</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2.5</div>
                  <div className={styles.plansTableCell}>2,500 ft²</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Lot 82</span>
                    <span className={styles.plansTableCommunity}>Whispering Hills</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2.5</div>
                  <div className={styles.plansTableCell}>2,600 ft²</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Lot 89</span>
                    <span className={styles.plansTableCommunity}>Whispering Hills</span>
                  </div>
                  <div className={styles.plansTableCell}>4</div>
                  <div className={styles.plansTableCell}>3.5</div>
                  <div className={styles.plansTableCell}>3,200 ft²</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                    <span className={styles.featureChip}>Finished LL</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Lot 104</span>
                    <span className={styles.plansTableCommunity}>Riverside Estates</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2.5</div>
                  <div className={styles.plansTableCell}>2,500 ft²</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                  </div>
                </div>
                <div className={styles.plansTableRow}>
                  <div className={`${styles.plansTableCell} ${styles.plansTableNameCell}`}>
                    <span className={styles.plansTableName}>Lot 117</span>
                    <span className={styles.plansTableCommunity}>The Pines</span>
                  </div>
                  <div className={styles.plansTableCell}>3</div>
                  <div className={styles.plansTableCell}>2.5</div>
                  <div className={styles.plansTableCell}>2,600 ft²</div>
                  <div className={styles.plansTableCell}>
                    <span className={styles.featureChip}>Fireplace</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {!isNewPlan && (
          <div className={styles.plansPagination}>
            <div className={styles.plansPaginationLeft}>
              <span className={styles.plansPaginationText}>Rows per page: 10</span>
              <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationDropdownIcon} />
            </div>
            <span className={styles.plansPaginationText}>1-5 of 13</span>
            <div className={styles.plansPaginationButtons}>
              <Button variant="secondary" iconOnly disabled aria-label="Previous page">‹</Button>
              <Button variant="secondary" iconOnly disabled aria-label="Next page">›</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PlansTab() {
  return (
    <div className={styles.plansTab}>
      <div className={styles.emptyState}>
        <div className={styles.emptyTitle}>Plans content coming soon</div>
      </div>
    </div>
  )
}
