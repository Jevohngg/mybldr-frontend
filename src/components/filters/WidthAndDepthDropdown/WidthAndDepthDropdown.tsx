import React from 'react'
import styles from './WidthAndDepthDropdown.module.css'

interface WidthAndDepthDropdownProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: WidthAndDepthFilters) => void
  initialFilters?: WidthAndDepthFilters
}

export interface WidthAndDepthFilters {
  widthMin: string
  widthMax: string
  depthMin: string
  depthMax: string
}

export default function WidthAndDepthDropdown({
  isOpen,
  onClose,
  onApply,
  initialFilters = { widthMin: '', widthMax: '', depthMin: '', depthMax: '' }
}: WidthAndDepthDropdownProps) {
  const [filters, setFilters] = React.useState<WidthAndDepthFilters>(initialFilters)
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

  const handleInputChange = (field: keyof WidthAndDepthFilters) => (
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
        {/* Width Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Width</div>
          <div className={styles.inputRow}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Minimum</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="0'"
                  value={filters.widthMin}
                  onChange={handleInputChange('widthMin')}
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
                  value={filters.widthMax}
                  onChange={handleInputChange('widthMax')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Depth Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Depth</div>
          <div className={styles.inputRow}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Minimum</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="0'"
                  value={filters.depthMin}
                  onChange={handleInputChange('depthMin')}
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
                  value={filters.depthMax}
                  onChange={handleInputChange('depthMax')}
                />
              </div>
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
