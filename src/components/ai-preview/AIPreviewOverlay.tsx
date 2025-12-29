import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AIPreviewOverlay.module.css'
import PaletteSelector, { palettes } from './PaletteSelector'
import CustomPaletteEditor from './CustomPaletteEditor'

interface AIPreviewOverlayProps {
  open: boolean
  onClose: () => void
}

export default function AIPreviewOverlay({ open, onClose }: AIPreviewOverlayProps) {
  const [showPaletteSelector, setShowPaletteSelector] = React.useState(true)
  const [selectedPaletteId, setSelectedPaletteId] = React.useState('1')
  const [showCustomPaletteEditor, setShowCustomPaletteEditor] = React.useState(false)

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
<img
  src="/assets/icons/plan-detail-header2.svg"
  width={24}
  height={24}
  className={styles.icon}
  alt=""
/>

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
                onCreateCustom={() => setShowCustomPaletteEditor(true)}
              />

              <CustomPaletteEditor
                open={showCustomPaletteEditor}
                onClose={() => setShowCustomPaletteEditor(false)}
              />

              <div className={styles.previewArea}>
                <div className={styles.previewContainer}>
                  <img
                    src={selectedPalette.previewImage}
                    alt="AI Generated House Preview"
                    className={styles.previewImage}
                  />
                  <button className={styles.imageControlBtn} aria-label="Image controls">
                    <img src="/assets/icons/enviroment.svg" alt="" width="20" height="20" />
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
