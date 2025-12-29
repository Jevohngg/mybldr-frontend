import React from 'react'
import styles from './CustomPaletteEditor.module.css'

interface CustomPaletteEditorProps {
  open: boolean
  onClose: () => void
}

interface MaterialOption {
  id: string
  name: string
  image: string
}

const materialOptions: Record<string, MaterialOption[]> = {
  'Main Siding': [
    { id: 'aluminum', name: 'Aluminum', image: '/assets/materials/main-siding/aluminum.jpg' },
    { id: 'stucco', name: 'Stucco', image: '/assets/materials/main-siding/stucco.jpg' },
    { id: 'wood-grain', name: 'Wood Grain', image: '/assets/materials/main-siding/wood-grain.jpg' },
    { id: 'wood-shake', name: 'Wood Shake', image: '/assets/materials/main-siding/wood-shake.jpg' },
  ],
  'Accent Siding': [
    { id: 'brick', name: 'Brick', image: '/assets/materials/accent-siding/brick.jpg' },
    { id: 'stone', name: 'Stone', image: '/assets/materials/accent-siding/stone.jpg' },
  ],
  'Roofing': [
    { id: 'shingle-dark', name: 'Dark Shingle', image: '/assets/materials/roofing/shingle-dark.jpg' },
    { id: 'shingle-light', name: 'Light Shingle', image: '/assets/materials/roofing/shingle-light.jpg' },
  ],
  'Masonry': [
    { id: 'brick-red', name: 'Red Brick', image: '/assets/materials/masonry/brick-red.jpg' },
    { id: 'stone-gray', name: 'Gray Stone', image: '/assets/materials/masonry/stone-gray.jpg' },
  ],
  'Trim': [
    { id: 'white', name: 'White', image: '/assets/materials/trim/white.jpg' },
    { id: 'beige', name: 'Beige', image: '/assets/materials/trim/beige.jpg' },
  ],
  'Front Door': [
    { id: 'black', name: 'Black', image: '/assets/materials/front-door/black.jpg' },
    { id: 'wood', name: 'Wood', image: '/assets/materials/front-door/wood.jpg' },
  ],
  'Light Fixtures': [
    { id: 'modern', name: 'Modern', image: '/assets/materials/light-fixtures/modern.jpg' },
    { id: 'traditional', name: 'Traditional', image: '/assets/materials/light-fixtures/traditional.jpg' },
  ],
  'Door Hardware': [
    { id: 'brushed-nickel', name: 'Brushed Nickel', image: '/assets/materials/door-hardware/brushed-nickel.jpg' },
    { id: 'oil-rubbed-bronze', name: 'Oil Rubbed Bronze', image: '/assets/materials/door-hardware/oil-rubbed-bronze.jpg' },
  ],
  'Flooring': [
    { id: 'hardwood', name: 'Hardwood', image: '/assets/materials/flooring/hardwood.jpg' },
    { id: 'tile', name: 'Tile', image: '/assets/materials/flooring/tile.jpg' },
  ],
  'Sink': [
    { id: 'stainless', name: 'Stainless Steel', image: '/assets/materials/sink/stainless.jpg' },
    { id: 'white', name: 'White', image: '/assets/materials/sink/white.jpg' },
  ]
}

const categories = [
  'Main Siding',
  'Accent Siding',
  'Roofing',
  'Masonry',
  'Trim',
  'Front Door',
  'Light Fixtures',
  'Door Hardware',
  'Flooring',
  'Sink'
]

export default function CustomPaletteEditor({ open, onClose }: CustomPaletteEditorProps) {
  const [paletteName, setPaletteName] = React.useState('Aberdeen')
  const [activeCategory, setActiveCategory] = React.useState('Main Siding')
  const [selections, setSelections] = React.useState<Record<string, string>>({
    'Main Siding': 'aluminum',
    'Accent Siding': 'brick',
    'Roofing': 'shingle-dark',
    'Masonry': 'brick-red',
    'Trim': 'white',
    'Front Door': 'black',
    'Light Fixtures': 'modern',
    'Door Hardware': 'brushed-nickel',
    'Flooring': 'hardwood',
    'Sink': 'stainless'
  })

  if (!open) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              Custom Palette: <span className={styles.paletteName}>{paletteName}</span>
            </h2>
            <button className={styles.editBtn} aria-label="Edit palette name">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.334 2A2.121 2.121 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className={styles.uploadSection}>
          <div className={styles.uploadContent}>
            <div className={styles.uploadText}>
              <h3 className={styles.uploadTitle}>Your palettes rendered in real time</h3>
              <p className={styles.uploadDescription}>
                Upload your look book and preview your design selections on your render in real time.
              </p>
            </div>
            <img src="/assets/materials/palette-image.png" alt="Preview mockup" className={styles.uploadMockup} />
          </div>
          <button className={styles.uploadBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.333 1.333 0 0 1 2 12.667V10M11.333 5.333 8 2m0 0L4.667 5.333M8 2v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
          </button>
        </div>

        <div className={styles.main}>
          <aside className={styles.sidebar}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>

          <div className={styles.content}>
            <div className={styles.materialsGrid}>
              {materialOptions[activeCategory]?.map((option) => (
                <label key={option.id} className={styles.materialCard}>
                  <input
                    type="radio"
                    name={activeCategory}
                    value={option.id}
                    checked={selections[activeCategory] === option.id}
                    onChange={(e) => setSelections({ ...selections, [activeCategory]: e.target.value })}
                    className={styles.radio}
                  />
                  <div className={styles.materialContent}>
                    <span className={styles.materialName}>{option.name}</span>
                    <img src={option.image} alt={option.name} className={styles.materialImage} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn}>Save</button>
        </footer>
      </div>
    </div>
  )
}
