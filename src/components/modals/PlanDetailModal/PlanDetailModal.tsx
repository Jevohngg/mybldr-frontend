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
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.backdrop} onClick={onClose} />
          <motion.div
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
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
  return (
    <div className={styles.overviewTab}>
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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Master Plan Set</h2>
        <div className={styles.emptyState}>
          <img src="/assets/empty-states/master-plan-set.svg" alt="" className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>Master plan set not selected</div>
          <div className={styles.emptyDescription}>
            Speed up takeoffs, get bids faster, and preview a render of your plan set.
          </div>
          <button className={styles.uploadBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Upload File
          </button>
        </div>
      </div>

      <div className={styles.section}>
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

      <div className={styles.section}>
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
