import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
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
  const [isImageLoading, setIsImageLoading] = React.useState(false)
  const loadingTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const selectedPalette = palettes.find(p => p.id === selectedPaletteId) || palettes[0]

  // Set loading state when palette changes, but with a delay
  // This prevents flashing for fast-loading (cached) images
  React.useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    // Hide loading initially
    setIsImageLoading(false)

    // Only show loading indicator after 300ms
    // If image loads before this, the indicator never appears
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsImageLoading(true)
    }, 300)

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [selectedPaletteId])

  // Handle image load completion
  const handleImageLoad = () => {
    // Clear the timeout if it hasn't fired yet
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
    // Hide loading indicator
    setIsImageLoading(false)
  }

  return (
    <>
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
                  <Button variant="ghost" size="sm" iconOnly className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</Button>
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

                <div className={styles.previewArea}>
                  <div className={styles.previewContainer}>
                    {isImageLoading && (
                      <div className={styles.imageLoadingOverlay}>
                        <div className={styles.imageLoadingSpinner}></div>
                        <p className={styles.imageLoadingText}>Generating preview...</p>
                      </div>
                    )}
                    <img
                      src={selectedPalette.previewImage}
                      alt="AI Generated House Preview"
                      className={styles.previewImage}
                      onLoad={handleImageLoad}
                      style={{ opacity: isImageLoading ? 0 : 1 }}
                    />
                    <button className={styles.imageControlBtn} aria-label="Image controls">
                      <img src="/assets/icons/enviroment.svg" alt="" width="20" height="20" />
                    </button>
                  </div>

                  <div className={styles.footer}>
                    <div className={styles.footerText}>
                      <h2 className={styles.footerTitle}>See your whole Plan Set in 3D</h2>
                      <p className={styles.footerDescription}>
                        Contact our team to create photo realistic models of your entire project.
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

      {/* CustomPaletteEditor rendered outside motion.div to escape stacking context */}
      <CustomPaletteEditor
        open={showCustomPaletteEditor}
        onClose={() => setShowCustomPaletteEditor(false)}
      />
    </>
  )
}
