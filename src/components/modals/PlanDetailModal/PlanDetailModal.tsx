import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import styles from './PlanDetailModal.module.css'
import PlanDetailSideNav from '../../../navigation/PlanDetailSideNav/PlanDetailSideNav'

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
  const [formData, setFormData] = React.useState({
    name: planName,
    description: '',
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
      setFormData({ name: planName, description: '' })
      setActiveTab('overview')
    }
  }, [open, planName])

  return (
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
            <div className={styles.container}>
              <PlanDetailSideNav
                planName={planName}
                communityCount={communityCount}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className={styles.content}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{activeTab === 'overview' ? 'Overview' : 'Plans'}</h1>
                  <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className={styles.body}>
                  {activeTab === 'overview' && (
                    <OverviewTab formData={formData} setFormData={setFormData} />
                  )}
                  {activeTab === 'plans' && (
                    <PlansTab />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function OverviewTab({ formData, setFormData }: {
  formData: { name: string; description: string }
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>
}) {
  const [isPreparing, setIsPreparing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleUpload = () => {
    setIsPreparing(true)
    setIsCompleted(false)
    setProgress(0)

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

        <div className={styles.formSection}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Enter the description to be used on marketing material..."
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
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
                    <button className={styles.viewNowBtn}>View Now</button>
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                        <path d="M8 10V3M5 6l3-3 3 3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
        <h2 className={styles.sectionTitle}>Communities that contain this plan set</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>Community</div>
            <div className={styles.tableHeaderCell}>Lots</div>
          </div>
          <div className={styles.emptyState}>
            <img src="/assets/empty-states/no-communities.svg" alt="" className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>No communities are currently using this plan set</div>
            <div className={styles.emptyDescription}>
              Communities that use this plan set will be shown here.
            </div>
          </div>
        </div>
        <div className={styles.pagination}>
          <span className={styles.paginationText}>Rows per page: 10</span>
          <span className={styles.paginationText}>0 of 0</span>
          <button className={styles.paginationBtn} disabled>‹</button>
          <button className={styles.paginationBtn} disabled>›</button>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Projects using this plan set</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>Project Name</div>
            <div className={styles.tableHeaderCell}>Community</div>
          </div>
          <div className={styles.emptyState}>
            <img src="/assets/empty-states/no-projects.svg" alt="" className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>No projects are currently using this plan set</div>
            <div className={styles.emptyDescription}>
              Projects that use this plan set will be shown here.
            </div>
          </div>
        </div>
        <div className={styles.pagination}>
          <span className={styles.paginationText}>Rows per page: 10</span>
          <span className={styles.paginationText}>1-5 of 13</span>
          <button className={styles.paginationBtn} disabled>‹</button>
          <button className={styles.paginationBtn}>›</button>
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
