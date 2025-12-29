import React from 'react'
import styles from './PaletteSelector.module.css'

interface PaletteSelectorProps {
  open: boolean
  onClose: () => void
  selectedPaletteId: string
  onSelectPalette: (paletteId: string) => void
  onCreateCustom: () => void
}

interface Palette {
  id: string
  paletteImage: string
  previewImage: string
}

export const palettes: Palette[] = [
  {
    id: '1',
    paletteImage: '/assets/palettes/palette-1.jpg',
    previewImage: '/assets/palettes/preview-1.jpg'
  },
  {
    id: '2',
    paletteImage: '/assets/palettes/palette-2.jpg',
    previewImage: '/assets/palettes/preview-2.jpg'
  },
  {
    id: '3',
    paletteImage: '/assets/palettes/palette-3.jpg',
    previewImage: '/assets/palettes/preview-3.jpg'
  },
  {
    id: '4',
    paletteImage: '/assets/palettes/palette-4.jpg',
    previewImage: '/assets/palettes/preview-4.jpg'
  },
]

export default function PaletteSelector({ open, onClose, selectedPaletteId, onSelectPalette, onCreateCustom }: PaletteSelectorProps) {
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
            className={`${styles.paletteCard} ${selectedPaletteId === palette.id ? styles.selected : ''}`}
            onClick={() => onSelectPalette(palette.id)}
          >
            <img
              src={palette.paletteImage}
              alt={`Palette ${palette.id}`}
              className={styles.paletteImage}
            />
          </button>
        ))}
      </div>

      <button className={styles.createCustomBtn} onClick={onCreateCustom}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Create Custom
      </button>
    </div>
  )
}
