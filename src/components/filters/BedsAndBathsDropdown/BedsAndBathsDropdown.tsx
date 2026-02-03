import React from 'react'
import styles from './BedsAndBathsDropdown.module.css'

interface BedsAndBathsDropdownProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: BedsAndBathsFilters) => void
  initialFilters?: BedsAndBathsFilters
}

export interface BedsAndBathsFilters {
  bedrooms: string
  bathrooms: string
  halfBaths: string
}

const OPTIONS = ['Any', '2', '3', '4', '5+']

export default function BedsAndBathsDropdown({
  isOpen,
  onClose,
  onApply,
  initialFilters = { bedrooms: 'Any', bathrooms: 'Any', halfBaths: 'Any' }
}: BedsAndBathsDropdownProps) {
  const [filters, setFilters] = React.useState<BedsAndBathsFilters>(initialFilters)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsAnimating(true)
      setFilters(initialFilters)
    } else if (isVisible) {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialFilters])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isVisible) return null

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  return (
    <div
      className={`${styles.dropdown} ${isAnimating ? styles.dropdownOpen : styles.dropdownClosing}`}
      ref={dropdownRef}
    >
      <div className={styles.content}>
        {/* Bedrooms Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Bedrooms</div>
          <div className={styles.buttonWrapper}>
            <div className={styles.buttonGroup}>
              {OPTIONS.map((option, index) => (
                <React.Fragment key={option}>
                  <button
                    className={`${styles.optionButton} ${filters.bedrooms === option ? styles.optionButtonActive : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, bedrooms: option }))}
                  >
                    {option}
                  </button>
                  {index < OPTIONS.length - 1 && <div className={styles.divider} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bathrooms Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Bathrooms</div>
          <div className={styles.buttonWrapper}>
            <div className={styles.buttonGroup}>
              {OPTIONS.map((option, index) => (
                <React.Fragment key={option}>
                  <button
                    className={`${styles.optionButton} ${filters.bathrooms === option ? styles.optionButtonActive : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, bathrooms: option }))}
                  >
                    {option}
                  </button>
                  {index < OPTIONS.length - 1 && <div className={styles.divider} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Half-baths Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Half-baths</div>
          <div className={styles.buttonWrapper}>
            <div className={styles.buttonGroup}>
              {OPTIONS.map((option, index) => (
                <React.Fragment key={option}>
                  <button
                    className={`${styles.optionButton} ${filters.halfBaths === option ? styles.optionButtonActive : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, halfBaths: option }))}
                  >
                    {option}
                  </button>
                  {index < OPTIONS.length - 1 && <div className={styles.divider} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className={styles.footer}>
        <button className={styles.applyButton} onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  )
}
