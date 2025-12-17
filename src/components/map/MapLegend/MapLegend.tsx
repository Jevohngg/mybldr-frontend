import React from 'react'
import styles from './MapLegend.module.css'

interface MapLegendProps {
  communityName: string
}

export default function MapLegend({ communityName }: MapLegendProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  return (
    <div className={styles.legend}>
      <div
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {/* TODO: add logo at public/assets/logos/community.svg */}
        <div className={styles.logoPh}>{communityName}</div>
        <div className={styles.title}>Legend</div>
        <div
          className={`${styles.caret} ${isExpanded ? styles.caretExpanded : styles.caretCollapsed}`}
          aria-hidden="true"
        >
          ▾
        </div>
      </div>

      {isExpanded && (
        <div className={styles.items}>
          <div className={styles.item}><span className={styles.swatchBlue} /> Available</div>
          <div className={styles.item}><span className={styles.swatchRed} /> QA</div>
          <div className={styles.item}><span className={styles.swatchTan} /> Reserved</div>
          <div className={styles.item}><span className={styles.swatchGray} /> Sold</div>
          <div className={styles.item}><span className={styles.star}>★</span> Move In Ready</div>
        </div>
      )}
    </div>
  )
}
