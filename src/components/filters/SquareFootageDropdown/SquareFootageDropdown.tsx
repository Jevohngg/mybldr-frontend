import React from 'react'
import styles from './SquareFootageDropdown.module.css'

interface SquareFootageDropdownProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: SquareFootageFilters) => void
  initialFilters?: SquareFootageFilters
}

export interface SquareFootageFilters {
  min: string
  max: string
}

export default function SquareFootageDropdown({
  isOpen,
  onClose,
  onApply,
  initialFilters = { min: '', max: '' }
}: SquareFootageDropdownProps) {
  const [filters, setFilters] = React.useState<SquareFootageFilters>(initialFilters)
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
      }, 200)
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

  const handleInputChange = (field: keyof SquareFootageFilters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div
      className={`${styles.dropdown} ${isAnimating ? styles.dropdownOpen : styles.dropdownClosing}`}
      ref={dropdownRef}
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Square footage</div>
          <div className={styles.inputRow}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Minimum</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="0'"
                  value={filters.min}
                  onChange={handleInputChange('min')}
                />
              </div>
            </div>
            <div className={styles.separator}>-</div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Maximum</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="0'"
                  value={filters.max}
                  onChange={handleInputChange('max')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.applyButton} onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  )
}
