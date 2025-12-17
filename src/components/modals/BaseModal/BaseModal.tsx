import { motion, AnimatePresence } from 'framer-motion'
import styles from './BaseModal.module.css'
import React from 'react'

export default function BaseModal({
  open,
  title,
  children,
  onClose,
  footer,
  width = 760,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
  width?: number
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className={styles.backdrop} onClick={onClose} />
          <motion.div
            className={styles.modal}
            style={{ width }}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className={styles.header}>
              <div className={styles.title}>{title}</div>
              <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
            </div>

            <div className={styles.body}>{children}</div>

            {footer && <div className={styles.footer}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
