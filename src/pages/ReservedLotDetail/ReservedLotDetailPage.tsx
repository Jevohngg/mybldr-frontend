import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../../app/providers'
import ReservedLotSideNav from '../../navigation/ReservedLotSideNav/ReservedLotSideNav'
import Button from '../../components/ui/Button'
import styles from './ReservedLotDetailPage.module.css'

type TabType = 'overview' | 'quotes' | 'documents'

interface ReservedLotData {
  lotNumber: string
  communityName: string
  model: string
  description: string
  projectName: string
  location: string
  city: string
  state: string
  zip: string
  image: string
  selectionProgress: number
  selectionsMade: number
  totalSelections: number
  selectionUrl: string
  pdfSize: string
}

const reservedLotsData: Record<string, ReservedLotData> = {
  '85': {
    lotNumber: '85',
    communityName: 'Kohler Ridge',
    model: 'The Aspen',
    description: 'A spacious, elegant design built for modern living. Explore its 3D model, customize elevations, and see how it fits your lifestyle.',
    projectName: 'Lot 85',
    location: 'Street address or job description',
    city: 'Amarillo',
    state: 'TX',
    zip: '54162',
    image: '/assets/plans/home-plan1.png',
    selectionProgress: 38,
    selectionsMade: 95,
    totalSelections: 250,
    selectionUrl: 'https://mybldr-demo.dev/selections',
    pdfSize: '100kb'
  },
  '823': {
    lotNumber: '823',
    communityName: 'Kohler Ridge',
    model: 'The Serena',
    description: 'A spacious, elegant design built for modern living. Explore its 3D model, customize elevations, and see how it fits your lifestyle.',
    projectName: 'Lot 823',
    location: 'Street address or job description',
    city: 'Amarillo',
    state: 'TX',
    zip: '54162',
    image: '/assets/plans/home-plan2.png',
    selectionProgress: 85,
    selectionsMade: 213,
    totalSelections: 250,
    selectionUrl: 'https://mybldr-demo.dev/selections',
    pdfSize: '100kb'
  }
}

const quotesData = [
  { name: 'Siding', status: 'In Progress', packs: 5, total: '$7,849.21' },
  { name: 'Interior Trim', status: 'Quote Requested', packs: 2, total: '$1,220.74' },
  { name: 'Framing and Exteriors', status: 'Expired', packs: 4, total: '$5,002.87' },
  { name: 'Lumber', status: 'Published', packs: 6, total: '$10,549.24' },
  { name: 'Truss', status: 'Published', packs: 1, total: '$1,228.90' },
]

export default function ReservedLotDetailPage() {
  const { communityId, lotNumber } = useParams<{ communityId: string; lotNumber: string }>()
  const navigate = useNavigate()
  const { communities } = useData()
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')

  const lotData = reservedLotsData[lotNumber || ''] || reservedLotsData['85']
  const community = communities.find((c) => c.id === communityId) || communities[0]

  const handleClose = () => {
    navigate(`/communities/${communityId}`)
  }

  // Listen for closeAllModals event (dispatched when navigating from search)
  React.useEffect(() => {
    const handleCloseModals = () => {
      navigate(`/communities/${communityId}`)
    }
    window.addEventListener('closeAllModals', handleCloseModals)
    return () => window.removeEventListener('closeAllModals', handleCloseModals)
  }, [communityId, navigate])

  return (
    <motion.div
      className={styles.page}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      <Button variant="ghost" size="sm" iconOnly className={styles.closeBtn} onClick={handleClose} aria-label="Close">✕</Button>
      <div className={styles.container}>
        <ReservedLotSideNav
          lotNumber={lotNumber || ''}
          communityName={community.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {activeTab === 'overview' ? 'Overview' : activeTab === 'quotes' ? 'Quotes' : 'Documents'}
            </h1>
            <img src="/assets/avatar-group.png" alt="" className={styles.addButton} />
          </div>

          <div className={styles.scrollableWrapper}>
            <div className={styles.centerContent}>
              {activeTab === 'overview' && <OverviewTab lotData={lotData} />}
              {activeTab === 'quotes' && <QuotesTab />}
              {activeTab === 'documents' && <DocumentsTab />}
            </div>

            {activeTab === 'overview' && (
              <div className={styles.rightSidebar}>
                <TitleBlockInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function OverviewTab({ lotData }: { lotData: ReservedLotData }) {
  const [formData, setFormData] = React.useState({
    model: lotData.model,
    description: lotData.description,
    projectName: lotData.projectName,
    location: lotData.location,
    city: lotData.city,
    state: lotData.state,
    zip: lotData.zip,
  })

  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(lotData.selectionUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Published':
        return styles.statusPublished
      case 'In Progress':
        return styles.statusInProgress
      case 'Quote Requested':
        return styles.statusRequested
      case 'Expired':
        return styles.statusExpired
      default:
        return ''
    }
  }

  return (
    <div className={styles.overviewTab}>
      <div className={styles.sectionCard}>
        <div className={styles.formSection}>
          <label className={styles.label}>Model</label>
          <input
            type="text"
            className={styles.input}
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Project Name</label>
          <input
            type="text"
            className={styles.input}
            value={formData.projectName}
            onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Location</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Street address or job description"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>City</label>
            <input
              type="text"
              className={styles.input}
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.label}>State</label>
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
          <div className={styles.formColumn}>
            <label className={styles.label}>Zip</label>
            <input
              type="text"
              className={styles.input}
              value={formData.zip}
              onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.planContainer}>
          <div className={styles.planWithSelectionContainer}>
            <div className={styles.planSection}>
              <label className={styles.label}>Plan</label>
              <div className={styles.planImage}>
                <img src={lotData.image} alt={lotData.model} />
              </div>
            </div>

            <div className={styles.selectionSection}>
              <h3 className={styles.selectionTitle}>3D Selection</h3>
              <p className={styles.selectionDescription}>
                See your home come to life as you choose your finishes and features in 3D.
              </p>
              <div className={styles.progressInfo}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${lotData.selectionProgress}%` }} />
                </div>
                <span className={styles.progressText}>{lotData.selectionsMade}/{lotData.totalSelections} Selections Made</span>
              </div>
              <div className={styles.urlSection}>
                <div className={styles.urlInput} onClick={handleCopy} style={{ cursor: 'pointer' }} title="Click to copy link">
                  <span className={styles.urlText}>{lotData.selectionUrl}</span>
                  <button type="button" className={styles.copyBtn} onClick={(e) => { e.stopPropagation(); handleCopy(); }}>{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <button
                  className={styles.makeSelectionsBtn}
                  onClick={() => window.open('/selections', '_blank')}
                >
                  <img src="/assets/icons/arrow-right.svg" alt="" width="16" height="16" />
                  Make Selections
                </button>
              </div>
            </div>
          </div>

          <div className={styles.attachmentSection}>
            <div className={styles.pdfAttachment}>
              <img src="/assets/pdf.png" alt="PDF" className={styles.pdfIcon} />
              <div className={styles.pdfInfo}>
                <div className={styles.pdfName}>{lotData.model.replace(/^The\s+/i, '').toLowerCase().replace(/\s+/g, '_')}.pdf</div>
                <div className={styles.pdfSize}>{lotData.pdfSize}</div>
              </div>
              <div className={styles.pdfActions}>
                <button className={styles.updateBtn}>Update</button>
                <Button variant="ghost" size="sm" iconOnly className={styles.removeBtn} aria-label="Remove attachment">✕</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Quotes</h2>
        <div className={styles.quotesTableWrapper}>
          <div className={styles.quotesTable}>
            <div className={styles.quotesTableHeader}>
              <div className={styles.quotesTableHeaderCell}>Name</div>
              <div className={styles.quotesTableHeaderCell}>Status</div>
              <div className={styles.quotesTableHeaderCell}>Packs</div>
              <div className={styles.quotesTableHeaderCell}>Total</div>
            </div>
            <div className={styles.quotesTableBody}>
              {quotesData.map((quote, index) => (
                <div key={index} className={styles.quotesTableRow}>
                  <div className={styles.quotesTableCell}>{quote.name}</div>
                  <div className={styles.quotesTableCell}>
                    <span className={`${styles.statusBadge} ${getStatusClass(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  <div className={styles.quotesTableCell}>{quote.packs}</div>
                  <div className={styles.quotesTableCell}>{quote.total}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span className={styles.paginationText}>Rows per page:</span>
              <span className={styles.paginationText}>5</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#636769" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.paginationText}>1-5 of 13</span>
            <div className={styles.paginationButtons}>
              <button className={styles.paginationBtn} disabled>‹</button>
              <button className={styles.paginationBtn}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuotesTab() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Published':
        return styles.statusPublished
      case 'In Progress':
        return styles.statusInProgress
      case 'Quote Requested':
        return styles.statusRequested
      case 'Expired':
        return styles.statusExpired
      default:
        return ''
    }
  }

  return (
    <div className={styles.quotesTab}>
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Quotes</h2>
        <div className={styles.quotesTable}>
          <div className={styles.quotesTableHeader}>
            <div className={styles.quotesTableHeaderCell}>Name</div>
            <div className={styles.quotesTableHeaderCell}>Status</div>
            <div className={styles.quotesTableHeaderCell}>Packs</div>
            <div className={styles.quotesTableHeaderCell}>Total</div>
          </div>
          <div className={styles.quotesTableBody}>
            {quotesData.map((quote, index) => (
              <div key={index} className={styles.quotesTableRow}>
                <div className={styles.quotesTableCell}>{quote.name}</div>
                <div className={styles.quotesTableCell}>
                  <span className={`${styles.statusBadge} ${getStatusClass(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
                <div className={styles.quotesTableCell}>{quote.packs}</div>
                <div className={styles.quotesTableCell}>{quote.total}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.pagination}>
          <div className={styles.paginationLeft}>
            <span className={styles.paginationText}>Rows per page: 5</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.paginationText}>1-5 of 13</span>
          <div className={styles.paginationButtons}>
            <button className={styles.paginationBtn} disabled>‹</button>
            <button className={styles.paginationBtn} disabled>›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsTab() {
  return (
    <div className={styles.documentsTab}>
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Documents</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No documents available</div>
          <div className={styles.emptyDescription}>Documents will appear here when uploaded</div>
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
