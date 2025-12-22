import React from 'react'
import styles from './CommunityMap.module.css'
import MapLegend from '../MapLegend/MapLegend'
import MapLot from '../MapLot/MapLot'
import LotDetailPopup from '../LotDetailPopup/LotDetailPopup'
import PlanDetailModal from '../../modals/PlanDetailModal/PlanDetailModal'
import { CommunityMapData, Lot } from '../types'

interface Plan {
  id: string
  name: string
  beds: string
  baths: string
  aru: string
  image: string
}

interface CommunityMapProps {
  data: CommunityMapData
}

export default function CommunityMap({ data }: CommunityMapProps) {
  const { communityName, lots } = data

  const svgRef = React.useRef<SVGSVGElement>(null)
  const [scale, setScale] = React.useState(1.5)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const [hoveredLotId, setHoveredLotId] = React.useState<string | null>(null)
  const [selectedLot, setSelectedLot] = React.useState<Lot | null>(null)
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 })
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.3, 4))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.3, 0.5))
  }

  const handleReset = () => {
    setScale(1.5)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isDragging && selectedLot) {
      const target = e.target as Element
      if (!target.closest(`.${styles.canvas} svg`)) {
        return
      }
      setSelectedLot(null)
    }
  }

  const handleLotClick = (lot: Lot, event: React.MouseEvent) => {
    const canvas = (event.currentTarget as Element).closest(`.${styles.canvas}`)
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const centerX = canvasRect.width / 2
    const centerY = canvasRect.height / 2

    setPopupPosition({ x: centerX, y: centerY })
    setSelectedLot(lot)
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLot) {
        setSelectedLot(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLot])

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={handleReset} aria-label="Reset view" title="Reset view">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 14L2 14L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className={styles.ctrlBtn} onClick={handleZoomOut} aria-label="Zoom out">－</button>
        <button className={styles.ctrlBtn} onClick={handleZoomIn} aria-label="Zoom in">＋</button>
      </div>

      <div
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1400 800"
          preserveAspectRatio="xMidYMid meet"
          className={styles.mapSvg}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <rect x="0" y="0" width="1400" height="800" fill="#E8EEE8" />

          {/* Water features */}
          <ellipse cx="280" cy="150" rx="90" ry="65" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="1120" cy="170" rx="85" ry="60" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="1100" cy="650" rx="90" ry="60" fill="#B8D4E8" opacity="0.35" />

          {/* Trees */}
          <circle cx="330" cy="120" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="360" cy="108" r="20" fill="#7A987A" opacity="0.5" />
          <circle cx="390" cy="125" r="24" fill="#8AA88A" opacity="0.5" />

          <circle cx="1150" cy="230" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="1180" cy="255" r="24" fill="#7A987A" opacity="0.5" />
          <circle cx="1170" cy="290" r="20" fill="#8AA88A" opacity="0.5" />

          <circle cx="380" cy="680" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="410" cy="693" r="20" fill="#7A987A" opacity="0.5" />
          <circle cx="440" cy="685" r="21" fill="#8AA88A" opacity="0.5" />

          {/* Road surface - fills gaps between lots */}
          <rect x="400" y="200" width="720" height="420" fill="#C4C0B8" opacity="0.3" rx="4" />

          {lots.map((lot) => (
            <MapLot
              key={lot.id}
              lot={lot}
              isHovered={hoveredLotId === lot.id}
              isSelected={selectedLot?.id === lot.id}
              onHover={setHoveredLotId}
              onClick={handleLotClick}
              scale={scale}
            />
          ))}
        </svg>

        <MapLegend communityName={communityName} />

        {selectedLot && (
          <LotDetailPopup
            lot={selectedLot}
            position={popupPosition}
            onClose={() => setSelectedLot(null)}
            onPlanClick={setSelectedPlan}
          />
        )}
      </div>

      {selectedPlan && (
        <PlanDetailModal
          open={true}
          planId={(selectedPlan as any).id || selectedPlan.name}
          planName={selectedPlan.name}
          communityCount={(selectedPlan as any).communityCount || 0}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  )
}
