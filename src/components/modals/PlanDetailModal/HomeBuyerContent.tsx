import React from 'react'
import styles from './HomeBuyerContent.module.css'

export default function HomeBuyerContent() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Home Buyer Content</h3>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Video Walkthrough</span>
          <a
            href="https://3dtour.wtsparadigm.com/LGIHomes/SpringbrookReserve-Birch/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Video
          </a>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Selection Book</span>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Selection Book
          </a>
        </div>
      </div>
    </div>
  )
}
