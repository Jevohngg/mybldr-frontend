import styles from './CommunityMap.module.css'
import MapLegend from '../MapLegend/MapLegend'

export default function CommunityMap() {
  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <button className={styles.ctrlBtn} aria-label="Search">🔍</button>
        <button className={styles.ctrlBtn} aria-label="Zoom out">－</button>
        <button className={styles.ctrlBtn} aria-label="Zoom in">＋</button>
      </div>

      <div className={styles.canvas}>
        {/* TODO: Put map image at public/assets/maps/community-map.png and replace this placeholder */}
        <div className={styles.mapPlaceholder}>
          Community map image placeholder
        </div>
        <MapLegend />
      </div>
    </div>
  )
}
