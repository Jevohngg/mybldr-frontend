import React from 'react'
import styles from './PaletteSelector.module.css'

interface PaletteSelectorProps {
  open: boolean
  onClose: () => void
  selectedPaletteId: string
  onSelectPalette: (paletteId: string) => void
}

interface Palette {
  id: string
  paletteImage: string
  previewImage: string
}

export const palettes: Palette[] = [
  {
    id: '1',
    paletteImage: 'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=400',
    previewImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    id: '2',
    paletteImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    previewImage: 'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    id: '3',
    paletteImage: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    previewImage: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    id: '4',
    paletteImage: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=400',
    previewImage: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
]

export default function PaletteSelector({ open, onClose, selectedPaletteId, onSelectPalette }: PaletteSelectorProps) {
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

      <button className={styles.createCustomBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Create Custom
      </button>
    </div>
  )
}
