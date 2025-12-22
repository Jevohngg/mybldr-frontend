import React from 'react'
import styles from './PaletteSelector.module.css'

interface PaletteSelectorProps {
  open: boolean
  onClose: () => void
}

interface ColorPalette {
  id: string
  colors: string[]
}

const palettes: ColorPalette[] = [
  { id: '1', colors: ['#5B6B82', '#394A5E', '#1F2937', '#4A5E77'] },
  { id: '2', colors: ['#9CA3AF', '#D1D5DB', '#F3F4F6', '#6B7280'] },
  { id: '3', colors: ['#C4B5A0', '#8B7355', '#E5DDD5', '#6B5D4F'] },
  { id: '4', colors: ['#8B9BAD', '#CBD5E1', '#F1F5F9', '#64748B'] },
]

export default function PaletteSelector({ open, onClose }: PaletteSelectorProps) {
  const [selectedPalette, setSelectedPalette] = React.useState<string | null>(null)

  if (!open) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Select a Palette</h3>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className={styles.palettesGrid}>
        {palettes.map((palette) => (
          <button
            key={palette.id}
            className={`${styles.paletteCard} ${selectedPalette === palette.id ? styles.selected : ''}`}
            onClick={() => setSelectedPalette(palette.id)}
          >
            <div className={styles.colorGrid}>
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className={styles.colorSwatch}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>

      <button className={styles.createCustomBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Create Custom
      </button>
    </div>
  )
}
