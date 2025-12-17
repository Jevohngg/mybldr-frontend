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
  const [scale, setScale] = React.useState(1.2)
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
    setScale((prev) => Math.max(prev / 1.3, 0.3))
  }

  const handleReset = () => {
    setScale(1.2)
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
        onClick={handleCanvasClick}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 2400 1600"
          preserveAspectRatio="xMidYMid meet"
          className={styles.mapSvg}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <rect x="0" y="0" width="2400" height="1600" fill="#E8EEE8" />

          {/* Water features - expanded */}
          <ellipse cx="280" cy="250" rx="110" ry="80" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="1950" cy="320" rx="130" ry="95" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="1850" cy="1250" rx="140" ry="100" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="450" cy="1350" rx="120" ry="85" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="2100" cy="800" rx="100" ry="70" fill="#B8D4E8" opacity="0.35" />
          <ellipse cx="200" cy="900" rx="95" ry="65" fill="#B8D4E8" opacity="0.35" />

          {/* Trees - expanded across canvas */}
          {/* Top left area */}
          <circle cx="330" cy="180" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="360" cy="160" r="20" fill="#7A987A" opacity="0.5" />
          <circle cx="390" cy="195" r="24" fill="#8AA88A" opacity="0.5" />
          <circle cx="250" cy="140" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="280" cy="165" r="23" fill="#7A987A" opacity="0.5" />

          {/* Top right area */}
          <circle cx="1950" cy="210" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="1980" cy="235" r="24" fill="#7A987A" opacity="0.5" />
          <circle cx="2020" cy="195" r="20" fill="#8AA88A" opacity="0.5" />
          <circle cx="2100" cy="250" r="22" fill="#7A987A" opacity="0.5" />
          <circle cx="2150" cy="180" r="21" fill="#8AA88A" opacity="0.5" />

          {/* Bottom left area */}
          <circle cx="380" cy="1300" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="410" cy="1330" r="20" fill="#7A987A" opacity="0.5" />
          <circle cx="340" cy="1280" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="250" cy="1400" r="23" fill="#7A987A" opacity="0.5" />
          <circle cx="290" cy="1370" r="22" fill="#8AA88A" opacity="0.5" />

          {/* Bottom right area */}
          <circle cx="1900" cy="1350" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="1940" cy="1380" r="24" fill="#7A987A" opacity="0.5" />
          <circle cx="1980" cy="1340" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="2080" cy="1420" r="23" fill="#7A987A" opacity="0.5" />
          <circle cx="2120" cy="1380" r="22" fill="#8AA88A" opacity="0.5" />

          {/* Right side */}
          <circle cx="2150" cy="650" r="21" fill="#8AA88A" opacity="0.5" />
          <circle cx="2180" cy="690" r="23" fill="#7A987A" opacity="0.5" />
          <circle cx="2200" cy="730" r="20" fill="#8AA88A" opacity="0.5" />

          {/* Left side */}
          <circle cx="150" cy="500" r="22" fill="#8AA88A" opacity="0.5" />
          <circle cx="180" cy="540" r="21" fill="#7A987A" opacity="0.5" />
          <circle cx="200" cy="580" r="23" fill="#8AA88A" opacity="0.5" />

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
          />
        )}
      </div>
    </div>
  )
}
