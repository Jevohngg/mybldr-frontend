import React from 'react'
import styles from './CategoriesDropdown.module.css'

interface CategoriesDropdownProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: CategoriesFilters) => void
  initialFilters?: CategoriesFilters
}

export interface CategoriesFilters {
  selectedCategories: string[]
}

const CATEGORIES = [
  'Bonus room',
  'Covered porch or patio',
  'Family room',
  'Finished lower level',
  'Fireplace',
  'Kitchen island',
  'Office or flex space',
  'Pocket door'
]

export default function CategoriesDropdown({
  isOpen,
  onClose,
  onApply,
  initialFilters = { selectedCategories: [] }
}: CategoriesDropdownProps) {
  const [filters, setFilters] = React.useState<CategoriesFilters>(initialFilters)
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

  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedCategories.includes(category)
      if (isSelected) {
        return {
          selectedCategories: prev.selectedCategories.filter(c => c !== category)
        }
      } else {
        return {
          selectedCategories: [...prev.selectedCategories, category]
        }
      }
    })
  }

  return (
    <div
      className={`${styles.dropdown} ${isAnimating ? styles.dropdownOpen : styles.dropdownClosing}`}
      ref={dropdownRef}
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>Categories</div>
          <div className={styles.checkboxList}>
            {CATEGORIES.map(category => {
              const isChecked = filters.selectedCategories.includes(category)
              return (
                <label key={category} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={isChecked}
                    onChange={() => toggleCategory(category)}
                  />
                  <span className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                    {isChecked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className={styles.checkboxLabel}>{category}</span>
                </label>
              )
            })}
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
