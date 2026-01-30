import { useState } from 'react'
import styles from './SelectionsPage.module.css'
import Input from '../../components/ui/Input'

interface FlooringOption {
  id: string
  name: string
  subtitle: string
  image: string
  cardImage: string
}

const flooringOptions: FlooringOption[] = [
  { id: 'albright-oak', name: 'Albright Oak', subtitle: '3.25-in, Red Oak, Kona Lg, Low Gloss', image: '/assets/viz-images/albright-oak.png', cardImage: '/assets/viz-images/albright-oak-2.jpg' },
  { id: 'pillar-oak', name: 'Pillar Oak', subtitle: '(White Oak), Quartz', image: '/assets/viz-images/pillar-oak.png', cardImage: '/assets/viz-images/pillar-oak-2.jpg' },
  { id: 'villa', name: 'Villa', subtitle: 'European Oak, Natural', image: '/assets/viz-images/villa.png', cardImage: '/assets/viz-images/villa-2.jpg' },
  { id: 'winfield-hickory', name: 'Winfield Hickory', subtitle: '5-in, Hickory, Provincial', image: '/assets/viz-images/winfield-hickory.png', cardImage: '/assets/viz-images/winfield-hickory-2.jpg' },
]

export default function SelectionsPage() {
  const [selectedRoom, setSelectedRoom] = useState('kitchen')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFlooring, setSelectedFlooring] = useState('pillar-oak')
  const [flooringSectionExpanded, setFlooringSectionExpanded] = useState(true)
  const [flooringGroupExpanded, setFlooringGroupExpanded] = useState(true)

  const selectedOption = flooringOptions.find(opt => opt.id === selectedFlooring)
  const displayImage = `/assets/viz-images/${selectedFlooring}.png`

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        {/* Room Dropdown */}
        <div className={styles.controlsSection}>
          <div className={styles.roomSelect}>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className={styles.dropdown}
            >
              <option value="kitchen">Kitchen</option>
            </select>
            <svg className={styles.dropdownIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.divider} />

        {/* First Floor Flooring Section */}
        <button
          className={styles.sectionHeader}
          onClick={() => setFlooringSectionExpanded(!flooringSectionExpanded)}
          aria-expanded={flooringSectionExpanded}
        >
          <span className={styles.sectionTitle}>First Floor Flooring</span>
          <svg
            className={`${styles.chevron} ${flooringSectionExpanded ? styles.expanded : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {flooringSectionExpanded && (
          <>
            <div className={styles.divider} />

            {/* Flooring Subsection */}
            <button
              className={styles.subsectionHeader}
              onClick={() => setFlooringGroupExpanded(!flooringGroupExpanded)}
              aria-expanded={flooringGroupExpanded}
            >
              <div className={styles.subsectionHeaderLeft}>
                <span className={styles.badge}>2 of 2</span>
                <span className={styles.subsectionTitle}>Flooring</span>
              </div>
              <svg
                className={`${styles.chevron} ${flooringGroupExpanded ? styles.expanded : ''}`}
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {flooringGroupExpanded && (
              <>
                <div className={styles.divider} />
                <div className={styles.optionsGrid}>
                  {flooringOptions.map((option) => {
                    const isSelected = selectedFlooring === option.id
                    return (
                      <button
                        key={option.id}
                        className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                        onClick={() => setSelectedFlooring(option.id)}
                      >
                        <div className={styles.optionImageWrapper}>
                          <img
                            src={option.cardImage}
                            alt={option.name}
                            className={styles.optionImage}
                          />
                          {/* Info icon */}
                          <button
                            className={styles.infoIcon}
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: Show info modal
                            }}
                            aria-label={`More info about ${option.name}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M6 5.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <circle cx="6" cy="3.5" r="0.75" fill="currentColor"/>
                            </svg>
                          </button>
                          {/* Checkmark overlay when selected */}
                          {isSelected && (
                            <div className={styles.checkmarkOverlay}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#1D6BCD"/>
                                <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={styles.optionText}>
                          <span className={styles.optionName}>{option.name}</span>
                          <span className={styles.optionSubtitle}>{option.subtitle}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

        <div className={styles.divider} />

        {/* Main Wall Color Section (collapsed) */}
        <button
          className={styles.sectionHeader}
          aria-expanded={false}
        >
          <span className={styles.sectionTitle}>Main Wall Color</span>
          <svg
            className={styles.chevron}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.divider} />
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <img
            src={displayImage}
            alt={selectedOption?.name || 'Design visualization'}
            className={styles.visualizationImage}
          />
        </div>
      </main>
    </div>
  )
}
