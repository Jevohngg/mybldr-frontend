import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Toast.module.css'

interface ToastProps {
  open: boolean
  message: string
  onClose: () => void
  duration?: number
  variant?: 'success' | 'error' | 'info'
}

export default function Toast({ open, message, onClose, duration = 4000, variant = 'success' }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`${styles.toast} ${styles[variant]}`}
          initial={{ opacity: 0, x: 16, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="status"
          aria-live="polite"
        >
          {variant === 'success' && (
            <svg className={styles.icon} width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M12.5 3.75L5.625 10.625L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <span className={styles.message}>{message}</span>
          <button className={styles.dismiss} onClick={onClose} aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
