import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import styles from './PlanDetailModal.module.css'
import PlanDetailSideNav from '../../../navigation/PlanDetailSideNav/PlanDetailSideNav'
import AIPreviewOverlay from '../../ai-preview/AIPreviewOverlay'
import TitleBlockInfo from './TitleBlockInfo'
import RecordInfo from './RecordInfo'
import PlanFeatures from './PlanFeatures'

type TabType = 'overview' | 'plans'

interface PlanDetailModalProps {
  open: boolean
  onClose: () => void
  planId: string
  planName: string
  communityCount: number
}

export default function PlanDetailModal({ open, onClose, planId, planName, communityCount }: PlanDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')
  const [aiPreviewOpen, setAiPreviewOpen] = React.useState(false)
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
      })
      setActiveTab('overview')
    }
  }, [open, planName])

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
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
            <div className={styles.container}>
              <PlanDetailSideNav
                planName={planName}
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
                      <OverviewTab formData={formData} setFormData={setFormData} onOpenAIPreview={() => setAiPreviewOpen(true)} />
                    )}
                    {activeTab === 'plans' && (
                      <PlansTab />
                    )}
                  </div>

                  {activeTab === 'overview' && (
                    <div className={styles.rightSidebar}>
                      <TitleBlockInfo />
                      <PlanFeatures />
                      <RecordInfo />
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

function OverviewTab({ formData, setFormData, onOpenAIPreview }: {
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
  }>>
  onOpenAIPreview: () => void
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

  return (
    <div className={styles.overviewTab}>
      <div className={styles.sectionCard}>
        <div className={styles.formSection}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Model ID</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter model id number"
              value={formData.modelId}
              onChange={(e) => setFormData(prev => ({ ...prev, modelId: e.target.value }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Master model ID</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter master model ID"
              value={formData.masterModelId}
              onChange={(e) => setFormData(prev => ({ ...prev, masterModelId: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Collection</label>
            <div className={styles.multiSelect}>
              <div className={styles.multiSelectContent}>
                {formData.collection.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('collection', item)}
                    >
                      ✕
                    </button>
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
            <div className={styles.multiSelect}>
              <div className={styles.multiSelectContent}>
                {formData.series.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('series', item)}
                    >
                      ✕
                    </button>
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
            <div className={styles.multiSelect}>
              <div className={styles.multiSelectContent}>
                {formData.structureType.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('structureType', item)}
                    >
                      ✕
                    </button>
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
            <div className={styles.multiSelect}>
              <div className={styles.multiSelectContent}>
                {formData.specificationLevel.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('specificationLevel', item)}
                    >
                      ✕
                    </button>
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
          <div className={styles.multiSelect}>
            <div className={styles.multiSelectContent}>
              {formData.division.map(item => (
                <span key={item} className={styles.tag}>
                  {item}
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={() => handleRemoveTag('division', item)}
                  >
                    ✕
                  </button>
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
          <textarea
            className={styles.textarea}
            placeholder="Enter plan description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
          />
        </div>

        <div className={styles.masterPlanSection}>
          <h2 className={styles.sectionTitle}>Master Plan Set</h2>
          <div className={styles.masterPlanContainer} ref={containerRef}>
            {!isPreparing && !isUploading && !isCompleted ? (
              <div className={styles.emptyState}>
                <img src="/assets/empty-states/master-plan-set.svg" alt="" className={styles.emptyIcon} />
                <div className={styles.emptyTitle}>Master plan set not selected</div>
                <div className={styles.emptyDescription}>
                  Speed up takeoffs, get bids faster, and preview a render of your plan set.
                </div>
                <button className={styles.uploadBtn} onClick={handleUpload}>
                  <img src="/assets/icons/plus.svg" alt="" width="16" height="16" style={{ marginRight: 6 }} />
                  Upload File
                </button>
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
                    <button className={styles.updateBtn}>Update</button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>✕</button>
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
                    <button className={styles.viewNowBtn} onClick={onOpenAIPreview}>View Now</button>
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
                      <button className={styles.updateBtnLarge}>Update</button>
                      <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                    </div>
                  </div>
                  <div className={styles.completedCard}>
                    <h4 className={styles.paletteTitle}>View with your palettes</h4>
                    <p className={styles.paletteDescription}>Preview your design by uploading your look book.</p>
                    <button className={styles.uploadPaletteBtn}>
                      <img src="/assets/icons/upload.svg" alt="" width="16" height="16" style={{ marginRight: 6 }} />
                      Upload
                    </button>
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
            <input
              type="number"
              className={styles.input}
              value={formData.bedrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Bathrooms</label>
            <input
              type="number"
              className={styles.input}
              value={formData.bathrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Half baths</label>
            <input
              type="number"
              className={styles.input}
              value={formData.halfBaths}
              onChange={(e) => setFormData(prev => ({ ...prev, halfBaths: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Garage spaces</label>
            <input
              type="number"
              className={styles.input}
              value={formData.garageSpaces}
              onChange={(e) => setFormData(prev => ({ ...prev, garageSpaces: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Total finished square footage</label>
            <div className={styles.inputWithSuffix}>
              <input
                type="number"
                className={styles.input}
                value={formData.totalFinishedSqft}
                onChange={(e) => setFormData(prev => ({ ...prev, totalFinishedSqft: Number(e.target.value) }))}
              />
              <span className={styles.inputSuffix}>Sqft</span>
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Total unfinished square footage</label>
            <div className={styles.inputWithSuffix}>
              <input
                type="number"
                className={styles.input}
                value={formData.totalUnfinishedSqft}
                onChange={(e) => setFormData(prev => ({ ...prev, totalUnfinishedSqft: Number(e.target.value) }))}
              />
              <span className={styles.inputSuffix}>Sqft</span>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>Width</label>
            <input
              type="text"
              className={styles.input}
              value={formData.width}
              onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Depth</label>
            <input
              type="text"
              className={styles.input}
              value={formData.depth}
              onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}># of elevations</label>
            <input
              type="number"
              className={styles.input}
              value={formData.numberOfElevations}
              onChange={(e) => setFormData(prev => ({ ...prev, numberOfElevations: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Foundation types</label>
            <div className={styles.multiSelect}>
              <div className={styles.multiSelectContent}>
                {formData.foundationTypes.map(item => (
                  <span key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag('foundationTypes', item)}
                    >
                      ✕
                    </button>
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
            <input
              type="number"
              className={styles.input}
              value={formData.costPerSquareFoot}
              onChange={(e) => setFormData(prev => ({ ...prev, costPerSquareFoot: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Floors</label>
            <input
              type="number"
              className={styles.input}
              value={formData.floors}
              onChange={(e) => setFormData(prev => ({ ...prev, floors: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className={styles.allDetailsSection}>
          <button
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
          </button>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.plansCreatedTitle}>Plans created from this model</h2>
        <div className={styles.plansTable}>
          <div className={styles.plansTableHeader}>
            <div className={styles.plansTableHeaderCell}>Name</div>
            <div className={styles.plansTableHeaderCell}>Beds</div>
            <div className={styles.plansTableHeaderCell}>Baths</div>
            <div className={styles.plansTableHeaderCell}>AUR</div>
            <div className={styles.plansTableHeaderCell}>Features</div>
          </div>
          <div className={styles.plansEmptyState}>
            <div className={styles.plansEmptyIconWrapper}>
              <img src="/assets/icons/plans-list.svg" alt="" className={styles.plansEmptyIcon} />
            </div>
            <div className={styles.plansEmptyTitle}>No plans have been created from this model</div>
            <div className={styles.plansEmptyDescription}>
              Plans that share this model will appear here
            </div>
          </div>
        </div>
        <div className={styles.plansPagination}>
          <div className={styles.plansPaginationLeft}>
            <span className={styles.plansPaginationText}>Rows per page: 10</span>
            <svg className={styles.paginationDropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.plansPaginationText}>1-5 of 13</span>
          <div className={styles.plansPaginationButtons}>
            <button className={styles.plansPaginationBtn}>‹</button>
            <button className={styles.plansPaginationBtn}>›</button>
          </div>
        </div>
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
