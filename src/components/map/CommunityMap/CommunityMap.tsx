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

          <ellipse cx="420" cy="380" rx="180" ry="120" fill="#A8C8E0" opacity="0.6" />
          <ellipse cx="1100" cy="180" rx="140" ry="100" fill="#A8C8E0" opacity="0.6" />

          <circle cx="450" cy="280" r="45" fill="#6B8E6B" opacity="0.7" />
          <circle cx="480" cy="310" r="38" fill="#5A7A5A" opacity="0.7" />
          <circle cx="520" cy="290" r="42" fill="#6B8E6B" opacity="0.7" />
          <circle cx="550" cy="330" r="35" fill="#5A7A5A" opacity="0.7" />

          <circle cx="700" cy="180" r="40" fill="#6B8E6B" opacity="0.7" />
          <circle cx="735" cy="200" r="35" fill="#5A7A5A" opacity="0.7" />
          <circle cx="770" cy="165" r="48" fill="#6B8E6B" opacity="0.7" />

          <circle cx="850" cy="210" r="42" fill="#6B8E6B" opacity="0.7" />
          <circle cx="885" cy="235" r="36" fill="#5A7A5A" opacity="0.7" />
          <circle cx="910" cy="200" r="40" fill="#6B8E6B" opacity="0.7" />

          <circle cx="1040" cy="290" r="35" fill="#6B8E6B" opacity="0.7" />
          <circle cx="1075" cy="315" r="40" fill="#5A7A5A" opacity="0.7" />
          <circle cx="1105" cy="280" r="38" fill="#6B8E6B" opacity="0.7" />

          <path d="M 600 650 Q 400 600 350 450 Q 320 350 400 250 Q 480 150 650 200 Q 750 220 850 300 Q 950 380 1000 500 Q 1020 580 950 650 Q 850 730 700 700 Q 650 690 600 650 Z" fill="#D8D8D0" stroke="white" strokeWidth="3" />

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
