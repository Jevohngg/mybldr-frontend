import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AIPreviewOverlay.module.css'
import PaletteSelector, { palettes } from './PaletteSelector'

interface AIPreviewOverlayProps {
  open: boolean
  onClose: () => void
}

export default function AIPreviewOverlay({ open, onClose }: AIPreviewOverlayProps) {
  const [showPaletteSelector, setShowPaletteSelector] = React.useState(true)
  const [selectedPaletteId, setSelectedPaletteId] = React.useState('1')

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const selectedPalette = palettes.find(p => p.id === selectedPaletteId) || palettes[0]

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.container}>
            <header className={styles.header}>
              <div className={styles.headerLeft}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.icon}>
                </svg>
                <h1 className={styles.title}>AI Generated Preview</h1>
              </div>
              <div className={styles.headerRight}>
                <button className={styles.shareBtn}>Share</button>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
              </div>
            </header>

            <main className={styles.main}>
              <PaletteSelector
                open={showPaletteSelector}
                onClose={() => setShowPaletteSelector(false)}
                selectedPaletteId={selectedPaletteId}
                onSelectPalette={setSelectedPaletteId}
              />

              <div className={styles.previewArea}>
                <div className={styles.previewContainer}>
                  <img
                    src={selectedPalette.previewImage}
                    alt="AI Generated House Preview"
                    className={styles.previewImage}
                  />
                  <button className={styles.imageControlBtn} aria-label="Image controls">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                <div className={styles.footer}>
                  <div className={styles.footerText}>
                    <h2 className={styles.footerTitle}>Perfection takes time</h2>
                    <p className={styles.footerDescription}>
                      Get a custom model of your plan built by our expert team.
                    </p>
                  </div>
                  <button className={styles.contactBtn}>Contact Sales</button>
                </div>
              </div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
