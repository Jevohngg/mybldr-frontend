import styles from './MapLegend.module.css'

export default function MapLegend() {
  return (
    <div className={styles.legend}>
      <div className={styles.header}>
        {/* TODO: add logo at public/assets/logos/oakrest.svg */}
        <div className={styles.logoPh}>Oakrest Ridge</div>
        <div className={styles.title}>Legend</div>
        <div className={styles.caret} aria-hidden="true">▾</div>
      </div>

      <div className={styles.items}>
        <div className={styles.item}><span className={styles.swatchBlue} /> Available</div>
        <div className={styles.item}><span className={styles.swatchRed} /> QA</div>
        <div className={styles.item}><span className={styles.swatchTan} /> Reserved</div>
        <div className={styles.item}><span className={styles.swatchGray} /> Sold</div>
        <div className={styles.item}><span className={styles.star}>★</span> Move In Ready</div>
      </div>
    </div>
  )
}
