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
          viewBox="250 100 900 600"
          preserveAspectRatio="xMidYMid meet"
          className={styles.mapSvg}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <rect x="0" y="0" width="1400" height="800" fill="#E8F0E8" />

          {/* Water features - smaller and at edges */}
          <ellipse cx="400" cy="220" rx="75" ry="55" fill="#A8C8E0" opacity="0.5" />
          <ellipse cx="1000" cy="200" rx="70" ry="50" fill="#A8C8E0" opacity="0.5" />
          <ellipse cx="970" cy="590" rx="75" ry="50" fill="#A8C8E0" opacity="0.5" />

          {/* Trees - smaller and at perimeter */}
          <circle cx="450" cy="170" r="28" fill="#6B8E6B" opacity="0.7" />
          <circle cx="490" cy="158" r="25" fill="#5A7A5A" opacity="0.7" />
          <circle cx="525" cy="175" r="30" fill="#6B8E6B" opacity="0.7" />

          <circle cx="1020" cy="280" r="27" fill="#6B8E6B" opacity="0.7" />
          <circle cx="1055" cy="310" r="30" fill="#5A7A5A" opacity="0.7" />
          <circle cx="1040" cy="350" r="26" fill="#6B8E6B" opacity="0.7" />

          <circle cx="520" cy="610" r="28" fill="#6B8E6B" opacity="0.7" />
          <circle cx="560" cy="623" r="25" fill="#5A7A5A" opacity="0.7" />
          <circle cx="600" cy="615" r="27" fill="#6B8E6B" opacity="0.7" />

          <circle cx="965" cy="540" r="25" fill="#6B8E6B" opacity="0.7" />
          <circle cx="1000" cy="565" r="28" fill="#5A7A5A" opacity="0.7" />
          <circle cx="980" cy="510" r="24" fill="#6B8E6B" opacity="0.7" />

          {/* Main community area - much larger */}
          <path
            d="M 850,400 Q 850,240 680,170 Q 550,120 430,170 Q 350,210 330,340 Q 320,430 380,550 Q 440,650 570,710 Q 710,770 830,720 Q 970,660 1010,530 Q 1030,440 970,340 Q 935,260 870,220"
            fill="#D8D8D0"
            stroke="white"
            strokeWidth="4"
            opacity="0.9"
          />

          {/* Outer ring road - more compact */}
          <ellipse cx="700" cy="400" rx="185" ry="150" fill="none" stroke="white" strokeWidth="45" opacity="0.85" />

          {/* Inner ring road - more compact */}
          <ellipse cx="700" cy="400" rx="105" ry="85" fill="none" stroke="white" strokeWidth="35" opacity="0.85" />

          {/* Center circle */}
          <circle cx="700" cy="400" r="40" fill="white" opacity="0.85" />

          {/* Connecting roads */}
          <path d="M 910 250 Q 860 230 790 235" fill="none" stroke="white" strokeWidth="32" opacity="0.85" />
          <path d="M 540 580 Q 575 605 635 615" fill="none" stroke="white" strokeWidth="32" opacity="0.85" />

          {/* Background lots - outer ring top section */}
          <polygon points="590,230 625,226 629,272 590,276" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="830,235 865,242 862,288 827,281" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - right side */}
          <polygon points="865,510 905,525 901,571 861,556" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - bottom section */}
          <polygon points="585,570 625,574 621,620 581,616" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="805,568 845,575 841,621 801,614" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - left side */}
          <polygon points="510,330 545,339 542,385 507,376" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="502,275 537,284 534,330 499,321" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

          {/* Background lots - inner ring - more compact */}
          <polygon points="670,325 705,323 707,365 670,367" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="730,323 765,325 767,367 730,365" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="742,465 777,463 779,505 742,507" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="690,468 725,470 727,512 690,510" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="630,468 665,470 667,512 630,510" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="585,452 620,454 622,496 585,494" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="562,395 597,397 599,439 562,437" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="570,340 605,342 607,384 570,382" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="770,375 805,373 807,415 770,417" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />
          <polygon points="790,328 825,326 827,368 790,370" fill="#C8C8C0" opacity="0.5" stroke="white" strokeWidth="1.5" />

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
