import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../../app/providers'
import LotConfigSideNav from '../../navigation/LotConfigSideNav/LotConfigSideNav'
import Button from '../../components/ui/Button'
import styles from './LotConfigurationPage.module.css'

type TabType = 'overview' | 'quotes' | 'documents'

interface Lot {
  lot_number: string
  status: string
  sqft?: number
}

interface Plan {
  id: string
  name: string
  beds: string
  baths: string
  sqft: string
  image: string
}

interface LocationState {
  lot: Lot
  plan: Plan
}

export default function LotConfigurationPage() {
  const { communityId, lotNumber } = useParams<{ communityId: string; lotNumber: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { communities } = useData()
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')

  const state = location.state as LocationState | null
  const lot = state?.lot
  const plan = state?.plan
  const community = communities.find((c) => c.id === communityId) || communities[0]

  const handleClose = () => {
    navigate(`/communities/${communityId}`)
  }

  // Redirect if no state (e.g., page refresh)
  React.useEffect(() => {
    if (!lot || !plan) {
      navigate(`/communities/${communityId}`)
    }
  }, [lot, plan, communityId, navigate])

  // Listen for closeAllModals event (dispatched when navigating from search)
  React.useEffect(() => {
    const handleCloseModals = () => {
      navigate(`/communities/${communityId}`)
    }
    window.addEventListener('closeAllModals', handleCloseModals)
    return () => window.removeEventListener('closeAllModals', handleCloseModals)
  }, [communityId, navigate])

  if (!lot || !plan) {
    return null
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className={styles.topRightActions}>
        <img src="/assets/avatar-group.png" alt="" className={styles.avatarGroup} />
        <Button variant="ghost" size="sm" iconOnly className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          ✕
        </Button>
      </div>
      <div className={styles.container}>
        <LotConfigSideNav
          lotNumber={lotNumber || ''}
          communityName={community.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Overview</h1>
          </div>

          <div className={styles.scrollableWrapper}>
            <div className={styles.centerContent}>
              {activeTab === 'overview' && <OverviewTab lot={lot} plan={plan} />}
            </div>

            <div className={styles.rightSidebar}>
              <TitleBlockInfo />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function OverviewTab({ lot, plan }: { lot: Lot; plan: Plan }) {
  const [formData, setFormData] = React.useState({
    projectName: `Lot ${lot.lot_number}`,
    location: '',
    city: '',
    state: 'TX',
    zip: '',
  })

  // Sample quotes data matching Figma design
  const quotesData = [
    { name: 'Siding', status: 'In Progress', packs: 5, total: '$7,849.21' },
    { name: 'Interior Trim', status: 'Quote Requested', packs: 2, total: '$1,220.74' },
    { name: 'Framing and Exteriors', status: 'Expired', packs: 4, total: '$5,002.87' },
    { name: 'Lumber', status: 'Published', packs: 6, total: '$10,549.24' },
    { name: 'Truss', status: 'Published', packs: 1, total: '$1,228.90' },
  ]

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress':
      case 'Quote Requested':
        return styles.statusGray
      case 'Expired':
        return styles.statusRed
      case 'Published':
        return styles.statusBlue
      default:
        return styles.statusGray
    }
  }

  return (
    <div className={styles.overviewTab}>
      {/* Card 1: Model & Description (read-only) */}
      <div className={styles.sectionCard}>
        <div className={styles.infoSection}>
          <span className={styles.infoLabel}>Model</span>
          <span className={styles.infoValue}>{plan.name}</span>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.infoLabel}>Description</span>
          <span className={styles.infoValue}>
            A spacious, elegant design built for modern living. Explore its 3D model, customize elevations, and see how it fits your lifestyle.
          </span>
        </div>
      </div>

      {/* Card 2: Project Details Form */}
      <div className={styles.sectionCard}>
        <div className={styles.formSection}>
          <label className={styles.label}>Project Name</label>
          <input
            type="text"
            className={styles.input}
            value={formData.projectName}
            onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Location</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Street address or job description"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>City</label>
            <input
              type="text"
              className={styles.input}
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>State</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              >
                <option value="TX">TX</option>
                <option value="CA">CA</option>
                <option value="FL">FL</option>
                <option value="NY">NY</option>
              </select>
              <svg className={styles.selectIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>Zip</label>
            <input
              type="text"
              className={styles.input}
              value={formData.zip}
              onChange={(e) => setFormData((prev) => ({ ...prev, zip: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.planContainer}>
          <label className={styles.label}>Plan</label>
          <div className={styles.planCardWrapper}>
            <div className={styles.planImageCard}>
              <img src={plan.image} alt={plan.name} className={styles.planCardImage} />
              <div className={styles.planOverlay}>
                <div className={styles.planOverlayGradient} />
                <div className={styles.planOverlayContent}>
                  <div className={styles.planOverlayText}>
                    <h3 className={styles.planOverlayTitle}>3D Selection</h3>
                    <p className={styles.planOverlayDescription}>
                      See your home come to life as you choose your finishes and features in 3D.
                    </p>
                  </div>
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '38%' }} />
                    </div>
                  </div>
                  <button className={styles.makeSelectionsBtn}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.16667 17.5C3.70833 17.5 3.31597 17.3368 2.98958 17.0104C2.66319 16.684 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66319 3.31597 2.98958 2.98958C3.31597 2.66319 3.70833 2.5 4.16667 2.5H9.16667C9.40278 2.5 9.60069 2.57986 9.76042 2.73958C9.92014 2.89931 10 3.09722 10 3.33333C10 3.56944 9.92014 3.76736 9.76042 3.92708C9.60069 4.08681 9.40278 4.16667 9.16667 4.16667H4.16667V15.8333H15.8333V10.8333C15.8333 10.5972 15.9132 10.3993 16.0729 10.2396C16.2326 10.0799 16.4306 10 16.6667 10C16.9028 10 17.1007 10.0799 17.2604 10.2396C17.4201 10.3993 17.5 10.5972 17.5 10.8333V15.8333C17.5 16.2917 17.3368 16.684 17.0104 17.0104C16.684 17.3368 16.2917 17.5 15.8333 17.5H4.16667ZM15.8333 5.33333L8.66667 12.5C8.51389 12.6528 8.31944 12.7292 8.08333 12.7292C7.84722 12.7292 7.65278 12.6528 7.5 12.5C7.34722 12.3472 7.27083 12.1528 7.27083 11.9167C7.27083 11.6806 7.34722 11.4861 7.5 11.3333L14.6667 4.16667H12.5C12.2639 4.16667 12.066 4.08681 11.9062 3.92708C11.7465 3.76736 11.6667 3.56944 11.6667 3.33333C11.6667 3.09722 11.7465 2.89931 11.9062 2.73958C12.066 2.57986 12.2639 2.5 12.5 2.5H17.5V7.5C17.5 7.73611 17.4201 7.93403 17.2604 8.09375C17.1007 8.25347 16.9028 8.33333 16.6667 8.33333C16.4306 8.33333 16.2326 8.25347 16.0729 8.09375C15.9132 7.93403 15.8333 7.73611 15.8333 7.5V5.33333Z" fill="#75787B"/>
                    </svg>
                    Make Selections
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.uploadItem}>
              <div className={styles.fileTypeIcon}>
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                  <path d="M0 4C0 1.79086 1.79086 0 4 0H20L32 12V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="white" stroke="#D5D7DA" strokeWidth="1.5"/>
                  <path d="M20 0L32 12H24C21.7909 12 20 10.2091 20 8V0Z" fill="white" stroke="#D5D7DA" strokeWidth="1.5"/>
                </svg>
                <div className={styles.fileTypeBadge}>PDF</div>
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{plan.name.replace(/^The\s+/i, '').toLowerCase().replace(/\s+/g, '_')}.pdf</span>
                <span className={styles.fileSize}>100kb</span>
              </div>
              <div className={styles.fileActions}>
                <Button variant="secondary" size="sm">Update</Button>
                <button className={styles.closeFileBtn} aria-label="Remove file">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15" stroke="#75787B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5L15 15" stroke="#75787B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Quotes Table */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Quotes</h2>
        <div className={styles.quotesTableWrapper}>
          <div className={styles.quotesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>Name</div>
            <div className={styles.tableHeaderCell}>Status</div>
            <div className={styles.tableHeaderCell}>Packs</div>
            <div className={styles.tableHeaderCell}>Total</div>
          </div>
          <div className={styles.tableBody}>
            {quotesData.map((quote, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.tableCell}>{quote.name}</div>
                <div className={styles.tableCell}>
                  <span className={getStatusClass(quote.status)}>{quote.status}</span>
                </div>
                <div className={styles.tableCell}>{quote.packs}</div>
                <div className={styles.tableCell}>{quote.total}</div>
              </div>
            ))}
          </div>
        </div>
          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span className={styles.paginationText}>Rows per page:</span>
              <span className={styles.paginationText}>5</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#636769"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={styles.paginationText}>1-5 of 13</span>
            <div className={styles.paginationButtons}>
              <button className={styles.paginationBtn} disabled>
                ‹
              </button>
              <button className={styles.paginationBtn}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TitleBlockInfo() {
  const [formData, setFormData] = React.useState({
    version: '',
    buildingCodes: '',
    permitNumber: '',
    issued: '',
    expires: '',
    governingBody: '',
    state: 'TX',
    adaCompliant: 'no'
  })

  return (
    <div className={styles.titleBlockCard}>
      <h3 className={styles.titleBlockTitle}>Title Block Info</h3>

      <div className={styles.titleBlockFields}>
        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>Version</label>
          <input
            type="text"
            className={styles.titleBlockInput}
            placeholder="Enter version"
            value={formData.version}
            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
          />
        </div>

        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>Building codes</label>
          <input
            type="text"
            className={styles.titleBlockInput}
            placeholder="Enter building codes"
            value={formData.buildingCodes}
            onChange={(e) => setFormData(prev => ({ ...prev, buildingCodes: e.target.value }))}
          />
        </div>

        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>Permit number</label>
          <input
            type="text"
            className={styles.titleBlockInput}
            placeholder="Enter permit number"
            value={formData.permitNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, permitNumber: e.target.value }))}
          />
        </div>

        <div className={styles.titleBlockRow}>
          <div className={styles.titleBlockField}>
            <label className={styles.titleBlockLabel}>Issued</label>
            <div className={styles.dateInputWrapper}>
              <svg className={styles.calendarIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 1.33333V4" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33333 1.33333V4" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 6.66667H14" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                className={styles.dateInput}
                placeholder="11/22/2025"
                value={formData.issued}
                onChange={(e) => setFormData(prev => ({ ...prev, issued: e.target.value }))}
              />
            </div>
          </div>
          <div className={styles.titleBlockField}>
            <label className={styles.titleBlockLabel}>Expires</label>
            <div className={styles.dateInputWrapper}>
              <svg className={styles.calendarIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 1.33333V4" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33333 1.33333V4" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 6.66667H14" stroke="#636769" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                className={styles.dateInput}
                placeholder="11/22/2025"
                value={formData.expires}
                onChange={(e) => setFormData(prev => ({ ...prev, expires: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>Governing Body</label>
          <input
            type="text"
            className={styles.titleBlockInput}
            placeholder="Enter governing body"
            value={formData.governingBody}
            onChange={(e) => setFormData(prev => ({ ...prev, governingBody: e.target.value }))}
          />
        </div>

        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>State</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            >
              <option value="TX">TX</option>
              <option value="CA">CA</option>
              <option value="FL">FL</option>
              <option value="NY">NY</option>
            </select>
            <svg className={styles.selectIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.titleBlockField}>
          <label className={styles.titleBlockLabel}>ADA Compliant</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="adaCompliant"
                value="yes"
                checked={formData.adaCompliant === 'yes'}
                onChange={(e) => setFormData(prev => ({ ...prev, adaCompliant: e.target.value }))}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Yes</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="adaCompliant"
                value="no"
                checked={formData.adaCompliant === 'no'}
                onChange={(e) => setFormData(prev => ({ ...prev, adaCompliant: e.target.value }))}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
