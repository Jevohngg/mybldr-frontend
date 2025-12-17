import React from 'react'
import styles from './CommunityMap.module.css'
import MapLegend from '../MapLegend/MapLegend'
import MapLot from '../MapLot/MapLot'
import LotDetailPopup from '../LotDetailPopup/LotDetailPopup'
import { CommunityMapData, Lot } from '../types'

interface CommunityMapProps {
  data: CommunityMapData
}

export default function CommunityMap({ data }: CommunityMapProps) {
  const { communityName, lots } = data

  const svgRef = React.useRef<SVGSVGElement>(null)
  const [scale, setScale] = React.useState(1)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const [hoveredLotId, setHoveredLotId] = React.useState<string | null>(null)
  const [selectedLot, setSelectedLot] = React.useState<Lot | null>(null)
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 })

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.3, 4))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.3, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === svgRef.current) {
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

  const handleLotClick = (lot: Lot) => {
    if (!svgRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const lotPoints = lot.position?.points?.split(' ').map((p) => {
      const [x, y] = p.split(',').map(Number)
      return { x, y }
    }) || []

    if (lotPoints.length > 0) {
      const centerX = lotPoints.reduce((sum, p) => sum + p.x, 0) / lotPoints.length
      const centerY = lotPoints.reduce((sum, p) => sum + p.y, 0) / lotPoints.length

      const screenX = svgRect.left + (centerX * scale) + position.x
      const screenY = svgRect.top + (centerY * scale) + position.y

      setPopupPosition({ x: screenX, y: screenY })
      setSelectedLot(lot)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 4))
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
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1400 800"
          className={styles.mapSvg}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <rect width="1400" height="800" fill="#E8F0E8" />

          <ellipse cx="280" cy="320" rx="160" ry="100" fill="#A8C8E0" opacity="0.6" />
          <ellipse cx="1180" cy="200" rx="120" ry="85" fill="#A8C8E0" opacity="0.6" />
          <ellipse cx="1100" cy="680" rx="140" ry="90" fill="#A8C8E0" opacity="0.6" />

          <circle cx="350" cy="120" r="48" fill="#6B8E6B" opacity="0.75" />
          <circle cx="410" cy="150" r="42" fill="#5A7A5A" opacity="0.75" />
          <circle cx="380" cy="200" r="38" fill="#6B8E6B" opacity="0.75" />
          <circle cx="320" cy="180" r="35" fill="#5A7A5A" opacity="0.75" />

          <circle cx="1200" cy="360" r="45" fill="#6B8E6B" opacity="0.75" />
          <circle cx="1240" cy="320" r="38" fill="#5A7A5A" opacity="0.75" />
          <circle cx="1270" cy="380" r="42" fill="#6B8E6B" opacity="0.75" />

          <circle cx="480" cy="620" r="40" fill="#6B8E6B" opacity="0.75" />
          <circle cx="440" cy="670" r="35" fill="#5A7A5A" opacity="0.75" />
          <circle cx="520" cy="680" r="38" fill="#6B8E6B" opacity="0.75" />

          <circle cx="1160" cy="540" r="42" fill="#6B8E6B" opacity="0.75" />
          <circle cx="1200" cy="580" r="36" fill="#5A7A5A" opacity="0.75" />
          <circle cx="1230" cy="520" r="40" fill="#6B8E6B" opacity="0.75" />

          <path
            d="M 870,400 Q 870,240 720,180 Q 600,140 500,180 Q 400,220 380,340 Q 370,420 420,520 Q 470,600 580,650 Q 700,700 800,660 Q 920,610 950,500 Q 970,420 920,340 Q 890,280 840,250"
            fill="#D8D8D0"
            stroke="white"
            strokeWidth="4"
            opacity="0.9"
          />

          <ellipse cx="870" cy="360" rx="210" ry="170" fill="none" stroke="white" strokeWidth="50" opacity="0.85" />

          <ellipse cx="870" cy="360" rx="120" ry="95" fill="none" stroke="white" strokeWidth="40" opacity="0.85" />

          <circle cx="870" cy="360" r="45" fill="white" opacity="0.85" />

          <path d="M 1120 200 Q 1050 170 950 180" fill="none" stroke="white" strokeWidth="35" opacity="0.85" />
          <path d="M 550 620 Q 600 660 680 680" fill="none" stroke="white" strokeWidth="35" opacity="0.85" />

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
      </div>

      {selectedLot && (
        <LotDetailPopup
          lot={selectedLot}
          position={popupPosition}
          onClose={() => setSelectedLot(null)}
        />
      )}
    </div>
  )
}
