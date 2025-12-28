import React from 'react'
import styles from './RecordInfo.module.css'

export default function RecordInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label className={styles.label}>Architect of record</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter architect name"
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Engineer of record</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter engineer name"
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Copyright owner</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter copyright owner"
        />
      </div>
    </div>
  )
}
