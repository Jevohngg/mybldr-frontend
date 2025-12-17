import React from 'react'
import { Lot } from '../types'
import styles from './MapLot.module.css'

interface MapLotProps {
  lot: Lot
  isHovered: boolean
  isSelected: boolean
  onHover: (lotId: string | null) => void
  onClick: (lot: Lot, event: React.MouseEvent) => void
  scale: number
}

export default function MapLot({
  lot,
  isHovered,
  isSelected,
  onHover,
  onClick,
  scale,
}: MapLotProps) {
  const getStatusColor = (status: string, hovered: boolean, selected: boolean) => {
    if (selected) {
      return {
        fill: getBaseColor(status),
        stroke: '#1a1a1a',
        strokeWidth: 2.5 / scale,
      }
    }

    if (hovered) {
      return {
        fill: getHoverColor(status),
        stroke: '#1a1a1a',
        strokeWidth: 2 / scale,
      }
    }

    return {
      fill: getBaseColor(status),
      stroke: '#ffffff',
      strokeWidth: 1.5 / scale,
    }
  }

  const getBaseColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4A90E2'
      case 'qa':
        return '#D94242'
      case 'reserved':
        return '#C9B8A0'
      case 'sold':
        return '#CCCCCC'
      default:
        return '#CCCCCC'
    }
  }

  const getHoverColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#5CA3F5'
      case 'qa':
        return '#E55555'
      case 'reserved':
        return '#D9C9B3'
      case 'sold':
        return '#DDDDDD'
      default:
        return '#DDDDDD'
    }
  }

  const { fill, stroke, strokeWidth } = getStatusColor(lot.status, isHovered, isSelected)

  const handleMouseEnter = () => {
    onHover(lot.id)
  }

  const handleMouseLeave = () => {
    onHover(null)
  }

  const handleClick = (event: React.MouseEvent) => {
    onClick(lot, event)
  }

  if (lot.shape_type === 'polygon' && lot.position?.points) {
    return (
      <g className={styles.lotGroup}>
        <polygon
          points={lot.position.points}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={styles.lot}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
        {lot.lot_number && (
          <text
            x={getLotCenterX(lot.position.points)}
            y={getLotCenterY(lot.position.points)}
            className={styles.lotNumber}
            style={{ fontSize: `${12 / scale}px` }}
            textAnchor="middle"
            dominantBaseline="middle"
            pointerEvents="none"
          >
            {lot.lot_number}
          </text>
        )}
        {lot.moveInReady && (
          <text
            x={getLotCenterX(lot.position.points)}
            y={getLotCenterY(lot.position.points) - (15 / scale)}
            className={styles.star}
            style={{ fontSize: `${14 / scale}px` }}
            textAnchor="middle"
            pointerEvents="none"
          >
            ★
          </text>
        )}
      </g>
    )
  }

  return null
}

function getLotCenterX(points: string): number {
  const coords = points.split(' ').map((p) => {
    const [x] = p.split(',').map(Number)
    return x
  })
  return coords.reduce((a, b) => a + b, 0) / coords.length
}

function getLotCenterY(points: string): number {
  const coords = points.split(' ').map((p) => {
    const [, y] = p.split(',').map(Number)
    return y
  })
  return coords.reduce((a, b) => a + b, 0) / coords.length
}
