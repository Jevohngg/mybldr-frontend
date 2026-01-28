import React from 'react'
import styles from './HomeBuyerContent.module.css'

interface HomeBuyerContentProps {
  isNewPlan?: boolean
}

export default function HomeBuyerContent({ isNewPlan = false }: HomeBuyerContentProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Home Buyer Content</h3>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Video Walkthrough</span>
          {isNewPlan ? (
            <span className={styles.placeholder}>Not added</span>
          ) : (
            <a
              href="https://3dtour.wtsparadigm.com/LGIHomes/SpringbrookReserve-Birch/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View Video
            </a>
          )}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Selection Book</span>
          {isNewPlan ? (
            <span className={styles.placeholder}>Not added</span>
          ) : (
            <a
              href="https://visualize.mybuild.wtsparadigm.com/?exlineId=ed90fcd9-1a16-4a32-9dc4-a62faf1696c8&exquoteId=2cc25f7b-1de0-4eac-bb9c-da6c7f0fba5d&signin=true"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View Selection Book
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
