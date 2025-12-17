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

          {/* Water features */}
          <ellipse cx="250" cy="280" rx="140" ry="95" fill="#A8C8E0" opacity="0.6" />
          <ellipse cx="1220" cy="180" rx="110" ry="80" fill="#A8C8E0" opacity="0.6" />
          <ellipse cx="1150" cy="680" rx="130" ry="85" fill="#A8C8E0" opacity="0.6" />

          {/* Trees - organized around perimeter */}
          <circle cx="320" cy="100" r="42" fill="#6B8E6B" opacity="0.75" />
          <circle cx="380" cy="80" r="38" fill="#5A7A5A" opacity="0.75" />
          <circle cx="430" cy="110" r="45" fill="#6B8E6B" opacity="0.75" />
          <circle cx="480" cy="90" r="35" fill="#5A7A5A" opacity="0.75" />

          <circle cx="1240" cy="320" r="40" fill="#6B8E6B" opacity="0.75" />
          <circle cx="1290" cy="360" r="45" fill="#5A7A5A" opacity="0.75" />
          <circle cx="1270" cy="420" r="38" fill="#6B8E6B" opacity="0.75" />

          <circle cx="420" cy="720" r="42" fill="#6B8E6B" opacity="0.75" />
          <circle cx="480" cy="740" r="38" fill="#5A7A5A" opacity="0.75" />
          <circle cx="540" cy="725" r="40" fill="#6B8E6B" opacity="0.75" />

          <circle cx="1200" cy="600" r="38" fill="#6B8E6B" opacity="0.75" />
          <circle cx="1250" cy="640" r="42" fill="#5A7A5A" opacity="0.75" />
          <circle cx="1220" cy="530" r="36" fill="#6B8E6B" opacity="0.75" />

          {/* Main community area */}
          <path
            d="M 870,400 Q 870,240 720,180 Q 600,140 500,180 Q 400,220 380,340 Q 370,420 420,520 Q 470,600 580,650 Q 700,700 800,660 Q 920,610 950,500 Q 970,420 920,340 Q 890,280 840,250"
            fill="#D8D8D0"
            stroke="white"
            strokeWidth="4"
            opacity="0.9"
          />

          {/* Outer ring road */}
          <ellipse cx="870" cy="400" rx="210" ry="170" fill="none" stroke="white" strokeWidth="50" opacity="0.85" />

          {/* Inner ring road */}
          <ellipse cx="870" cy="400" rx="120" ry="95" fill="none" stroke="white" strokeWidth="40" opacity="0.85" />

          {/* Center circle */}
          <circle cx="870" cy="400" r="45" fill="white" opacity="0.85" />

          {/* Connecting roads */}
          <path d="M 1120 230 Q 1050 200 950 210" fill="none" stroke="white" strokeWidth="35" opacity="0.85" />
          <path d="M 550 650 Q 600 680 680 695" fill="none" stroke="white" strokeWidth="35" opacity="0.85" />

          {/* Background lots - outer ring top section */}
          <polygon points="695,195 735,190 740,245 695,250" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="1060,200 1100,210 1095,265 1055,255" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - right side */}
          <polygon points="1075,550 1120,568 1115,623 1070,605" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - bottom section */}
          <polygon points="665,660 710,665 705,720 660,715" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="1000,658 1045,667 1040,722 995,713" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - left side */}
          <polygon points="580,300 625,312 620,367 575,355" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="570,235 615,247 610,302 565,290" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - inner ring */}
          <polygon points="830,310 870,307 873,355 830,358" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="910,307 950,310 953,358 910,355" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="925,480 965,477 968,525 925,528" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="860,485 900,488 903,536 860,533" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="785,485 825,488 828,536 785,533" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="730,465 770,468 773,516 730,513" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="700,395 740,398 743,446 700,443" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="710,325 750,328 753,376 710,373" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="955,368 995,365 998,413 955,416" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="980,305 1020,302 1023,350 980,353" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

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
