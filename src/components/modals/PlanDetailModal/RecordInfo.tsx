import React from 'react'
import styles from './RecordInfo.module.css'

interface RecordInfoProps {
  architectOfRecord?: string
  engineerOfRecord?: string
  copyrightOwner?: string
  onArchitectChange?: (value: string) => void
  onEngineerChange?: (value: string) => void
  onCopyrightChange?: (value: string) => void
  isLoading?: boolean
  isPopulated?: boolean
}

export default function RecordInfo({
  architectOfRecord = '',
  engineerOfRecord = '',
  copyrightOwner = '',
  onArchitectChange,
  onEngineerChange,
  onCopyrightChange,
  isLoading = false,
  isPopulated = false,
}: RecordInfoProps) {
  const getInputClassName = () => {
    const classes = [styles.input]
    if (isLoading) classes.push(styles.inputLoading)
    if (isPopulated) classes.push(styles.inputPopulated)
    return classes.join(' ')
  }

  const FieldSpinner = () => (
    <div className={styles.fieldSpinner}>
      <svg className={styles.fieldSpinnerSvg} viewBox="0 0 50 50">
        <circle className={styles.fieldSpinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
      </svg>
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label className={styles.label}>Architect of record</label>
        <div className={styles.inputWrapper}>
          {isLoading && <FieldSpinner />}
          <input
            type="text"
            className={getInputClassName()}
            placeholder="Enter architect name"
            value={architectOfRecord}
            onChange={(e) => onArchitectChange?.(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Engineer of record</label>
        <div className={styles.inputWrapper}>
          {isLoading && <FieldSpinner />}
          <input
            type="text"
            className={getInputClassName()}
            placeholder="Enter engineer name"
            value={engineerOfRecord}
            onChange={(e) => onEngineerChange?.(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Copyright owner</label>
        <div className={styles.inputWrapper}>
          {isLoading && <FieldSpinner />}
          <input
            type="text"
            className={getInputClassName()}
            placeholder="Enter copyright owner"
            value={copyrightOwner}
            onChange={(e) => onCopyrightChange?.(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
