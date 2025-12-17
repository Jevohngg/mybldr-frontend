import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        <div className={styles.logoPh}>{communityName}</div>
        <div className={styles.title}>Legend</div>
        <motion.div
          className={styles.caret}
          animate={{ rotate: isExpanded ? 0 : -180 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className={styles.items}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.item}><span className={styles.swatchBlue} /> Available</div>
            <div className={styles.item}><span className={styles.swatchRed} /> QA</div>
            <div className={styles.item}><span className={styles.swatchTan} /> Reserved</div>
            <div className={styles.item}><span className={styles.swatchGray} /> Sold</div>
            <div className={styles.item}><span className={styles.star}>★</span> Move In Ready</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
