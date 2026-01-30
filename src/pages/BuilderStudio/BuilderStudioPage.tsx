import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BuilderStudioPage.module.css'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

type TabId = 'options' | 'exclusion-rules' | 'products' | 'setup'

interface Tab {
  id: TabId
  label: string
  icon: string
  variant: 'text' | 'outlined'
}

const tabs: Tab[] = [
  { id: 'options', label: 'Options', icon: 'format_color_fill', variant: 'text' },
  { id: 'exclusion-rules', label: 'Options Exclusion Rules', icon: 'rule', variant: 'outlined' },
  { id: 'products', label: 'Products', icon: 'inventory', variant: 'outlined' },
  { id: 'setup', label: 'Setup', icon: 'settings', variant: 'text' },
]

interface CategoryItem {
  id: string
  name: string
  icon: string
}

const categories: CategoryItem[] = [
  { id: 'siding', name: 'Siding', icon: 'siding' },
  { id: 'roofing', name: 'Roofing', icon: 'roofing' },
  { id: 'windows', name: 'Windows', icon: 'window' },
  { id: 'flooring', name: 'Flooring', icon: 'flooring' },
  { id: 'brick-stone', name: 'Brick & Stone', icon: 'brick' },
  { id: 'appliances', name: 'Appliances', icon: 'appliances' },
  { id: 'wood-stain', name: 'Wood Stain', icon: 'wood_stain' },
  { id: 'exterior-trim', name: 'Exterior Trim', icon: 'trim' },
  { id: 'soffit', name: 'Soffit', icon: 'soffit' },
  { id: 'shutters', name: 'Shutters', icon: 'shutters' },
  { id: 'front-door', name: 'Front Door', icon: 'door' },
  { id: 'exterior-hardware', name: 'Exterior Hardware', icon: 'hardware' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', icon: 'placeholder' },
  { id: 'exterior-stairs', name: 'Exterior Stairs', icon: 'stairs' },
  { id: 'exterior-railing', name: 'Exterior Railing', icon: 'railing' },
]

interface Product {
  id: string
  manufacturer: string
  name: string
  image: string
  status: 'included' | 'excluded'
}

const sidingProducts: Product[] = [
  // Randomized order of all products
  { id: 'p1', manufacturer: 'Builders FirstSource', name: '6" Pine #117 Lap', image: '/assets/products/siding-product-1.png', status: 'excluded' },
  { id: 'jh1', manufacturer: 'James Hardie', name: 'Hardie Artisan 10-1/4" Lap...', image: '/assets/products/jh-product-1.png', status: 'excluded' },
  { id: 'p5', manufacturer: 'Allura', name: 'Allura 6-1/4" Lap Smooth Si...', image: '/assets/products/siding-product-5.png', status: 'excluded' },
  { id: 'jh3', manufacturer: 'James Hardie', name: 'Cemplank Plank 8-1/4" Lap...', image: '/assets/products/jh-product-3.png', status: 'excluded' },
  { id: 'p3', manufacturer: 'Delta Millworks', name: '6" Thermowood Spruce Sm...', image: '/assets/products/siding-product-3.png', status: 'excluded' },
  { id: 'jh5', manufacturer: 'James Hardie', name: 'Hardie Artisan 8-1/4" V...', image: '/assets/products/jh-product-5.png', status: 'excluded' },
  { id: 'p2', manufacturer: 'Real Hard Wood Products', name: '6" Spruce Tongue', image: '/assets/products/siding-product-2.png', status: 'excluded' },
  { id: 'jh2', manufacturer: 'James Hardie', name: 'Cemplank Plank 7-1/4" Lap...', image: '/assets/products/jh-product-2.png', status: 'excluded' },
  { id: 'p6', manufacturer: 'Allura', name: '6" Cedar Lap Siding', image: '/assets/products/siding-product-6.png', status: 'excluded' },
  { id: 'jh7', manufacturer: 'James Hardie', name: 'Hardie Artisan 8-1/4" V...', image: '/assets/products/jh-product-7.png', status: 'excluded' },
  { id: 'p4', manufacturer: 'Real Hard Wood Products', name: '8" Pine Log Cabin Siding', image: '/assets/products/siding-product-4.png', status: 'excluded' },
  { id: 'jh4', manufacturer: 'James Hardie', name: 'Cemplank Plank 9-1/4" Lap...', image: '/assets/products/jh-product-4.png', status: 'excluded' },
  { id: 'p7', manufacturer: 'Real Hard Wood Products', name: '8" Cedar Lap & Gap 2', image: '/assets/products/siding-product-7.png', status: 'excluded' },
  { id: 'jh6', manufacturer: 'James Hardie', name: 'Cemplank Plank 7-1/4" Lap...', image: '/assets/products/jh-product-6.png', status: 'excluded' },
  { id: 'p8', manufacturer: 'Real Hard Wood Products', name: '7" Cedar Bevel Siding', image: '/assets/products/siding-product-8.png', status: 'excluded' },
  { id: 'jh8', manufacturer: 'James Hardie', name: 'Hardie Artisan 8-1/4" V...', image: '/assets/products/jh-product-8.png', status: 'excluded' },
]

// Derive manufacturers from actual product data
const manufacturers = [...new Set(sidingProducts.map(p => p.manufacturer))].sort()

export default function BuilderStudioPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('options')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Product filters state
  const [bfsOnly, setBfsOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'included' | 'excluded'>('all')
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayedCategories = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, 15)

  // Filter products based on search and filters
  const filteredProducts = sidingProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(productSearchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesManufacturer = selectedManufacturers.length === 0 ||
      selectedManufacturers.includes(product.manufacturer)
    return matchesSearch && matchesStatus && matchesManufacturer
  })

  const handleBack = () => {
    navigate(-1)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
    setSelectAll(!selectAll)
  }

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleManufacturer = (manufacturer: string) => {
    setSelectedManufacturers(prev =>
      prev.includes(manufacturer)
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    )
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.pageTitle}>New Product Filter</span>
        </button>
        <Button variant="primary" size="small" className={styles.saveButton}>
          Save Changes
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Tab Bar */}
          <div className={styles.tabBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const tabClassName = `${styles.tab} ${
                tab.variant === 'outlined' ? styles.tabOutlined : styles.tabText
              } ${isActive ? styles.tabActive : ''}`

              return (
                <button
                  key={tab.id}
                  className={tabClassName}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.tabIcon}>
                    <TabIcon name={tab.icon} />
                  </span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Input
              type="text"
              placeholder="Search Selection Categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Category Cards Grid */}
          <div className={styles.categoryGrid}>
            {displayedCategories.map((category) => {
              const isSelected = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  className={`${styles.categoryCard} ${isSelected ? styles.categoryCardSelected : ''}`}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                >
                  <span className={styles.categoryIcon}>
                    <CategoryIcon name={category.icon} />
                  </span>
                  <span className={styles.categoryName}>{category.name}</span>
                </button>
              )
            })}

            {/* Show More */}
            {filteredCategories.length > 15 && !showAllCategories && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAllCategories(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Show More</span>
              </button>
            )}
          </div>

          {/* Expanded Products Section - shows when category is selected */}
          {selectedCategory && (
            <div className={styles.expandedSection}>
              {/* Left Sidebar - Filters */}
              <div className={styles.filterSidebar}>
                {/* Available from BFS Card */}
                <div className={styles.filterCard}>
                  <div className={styles.filterCardHeader}>
                    <span className={styles.filterCardTitle}>Available from BFS</span>
                  </div>
                  <div className={styles.filterCardContent}>
                    <div className={styles.bfsLogoWrapper}>
                      <img src="/assets/bfs-logo.png" alt="Builders FirstSource" className={styles.bfsLogo} />
                    </div>
                    <button
                      className={`${styles.toggle} ${bfsOnly ? styles.toggleOn : ''}`}
                      onClick={() => setBfsOnly(!bfsOnly)}
                    >
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleThumb} />
                        <span className={styles.toggleLabel}>{bfsOnly ? 'ON' : 'OFF'}</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Status Card */}
                <div className={styles.filterCard}>
                  <div className={styles.filterCardHeader}>
                    <span className={styles.filterCardTitle}>Status</span>
                  </div>
                  <div className={styles.filterCardOptions}>
                    <label className={styles.filterCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={statusFilter === 'included' || statusFilter === 'all'}
                        onChange={() => setStatusFilter(statusFilter === 'included' ? 'all' : 'included')}
                        className={styles.checkbox}
                      />
                      <span className={styles.filterCheckboxCustom} />
                      <span>Included</span>
                    </label>
                    <label className={styles.filterCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={statusFilter === 'excluded' || statusFilter === 'all'}
                        onChange={() => setStatusFilter(statusFilter === 'excluded' ? 'all' : 'excluded')}
                        className={styles.checkbox}
                      />
                      <span className={styles.filterCheckboxCustom} />
                      <span>Excluded</span>
                    </label>
                  </div>
                </div>

                {/* Manufacturer Card */}
                <div className={styles.filterCard}>
                  <div className={styles.filterCardHeader}>
                    <span className={styles.filterCardTitle}>Manufacturer</span>
                  </div>
                  <div className={styles.filterCardOptions}>
                    {manufacturers.map(mfr => (
                      <label key={mfr} className={styles.filterCheckboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedManufacturers.includes(mfr)}
                          onChange={() => toggleManufacturer(mfr)}
                          className={styles.checkbox}
                        />
                        <span className={styles.filterCheckboxCustom} />
                        <span>{mfr}</span>
                      </label>
                    ))}
                    <button className={styles.seeMoreLink}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span>See More</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Content - Products */}
              <div className={styles.productsPanel}>
                {/* Products Header */}
                <div className={styles.productsHeader}>
                  <div className={styles.productsSearchWrapper}>
                    <svg className={styles.productsSearchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <Input
                      type="text"
                      placeholder="Search Options"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className={styles.productsSearchInput}
                    />
                  </div>

                  <button className={styles.sortButton}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path d="M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z" fill="currentColor"/>
                    </svg>
                    <span>Sort by:</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>

                {/* Select All Row */}
                <div className={styles.selectAllRow}>
                  <button
                    className={styles.selectAllButton}
                    onClick={handleSelectAll}
                  >
                    Select All
                  </button>
                </div>

                {/* Products Grid */}
                <div className={styles.productsGrid}>
                  {filteredProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImageWrapper}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.productDetails}>
                          <span className={styles.productManufacturer}>{product.manufacturer}</span>
                          <span className={styles.productName}>{product.name}</span>
                        </div>
                        <button className={styles.associatedProductsLink}>
                          Associated Products
                        </button>
                        <div className={styles.productStatus}>
                          <span className={`${styles.statusBadge} ${styles.statusExcluded}`}>
                            <span className={styles.statusDot} />
                            Excluded
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Icon component for tabs
function TabIcon({ name }: { name: string }) {
  switch (name) {
    case 'format_color_fill':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M16.56 8.94L7.62 0L6.21 1.41L8.38 3.58L1.44 10.52C0.89 11.07 0.89 11.96 1.44 12.5L7.94 19C8.22 19.28 8.58 19.42 8.95 19.42C9.32 19.42 9.69 19.28 9.96 19L16.56 12.4C17.11 11.86 17.11 10.97 16.56 8.94ZM3.91 11.5L8.95 6.46L13.99 11.5H3.91ZM20 16C20 18.21 18.21 20 16 20C13.79 20 12 18.21 12 16C12 13.5 16 9 16 9C16 9 20 13.5 20 16Z" fill="currentColor"/>
        </svg>
      )
    case 'rule':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M16 4H18V6H20V8H18V10H16V8H14V6H16V4Z" fill="currentColor"/>
          <path d="M2 11V13H12V11H2Z" fill="currentColor"/>
          <path d="M2 15V17H12V15H2Z" fill="currentColor"/>
          <path d="M14 15V17H22V15H14Z" fill="currentColor"/>
          <path d="M2 19V21H12V19H2Z" fill="currentColor"/>
          <path d="M14 19V21H22V19H14Z" fill="currentColor"/>
        </svg>
      )
    case 'inventory':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C3 2 2 2.9 2 4V7.01C2 7.73 2.43 8.35 3 8.7V20C3 21.1 4.1 22 5 22H19C19.9 22 21 21.1 21 20V8.7C21.57 8.35 22 7.73 22 7.01V4C22 2.9 21 2 20 2ZM15 14H9V12H15V14ZM20 7H4V4H20V7Z" fill="currentColor"/>
        </svg>
      )
    case 'settings':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
        </svg>
      )
    default:
      return null
  }
}

// Icon component for category cards
function CategoryIcon({ name }: { name: string }) {
  switch (name) {
    case 'siding':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="4" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="10" width="18" height="4" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="16" width="18" height="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'roofing':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L2 12H5V20H19V12H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 20V14H15V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'window':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'flooring':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'brick':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="9" height="5" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="4" width="9" height="5" stroke="currentColor" strokeWidth="2"/>
          <rect x="6" y="10" width="9" height="5" stroke="currentColor" strokeWidth="2"/>
          <rect x="2" y="16" width="9" height="5" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="16" width="9" height="5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'appliances':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'wood_stain':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 2L17 2C18.1046 2 19 2.89543 19 4V8L12 12L5 8V4C5 2.89543 5.89543 2 7 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 8L12 12L19 8" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 12V22" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'trim':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H21V7H3V3Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 7V21" stroke="currentColor" strokeWidth="2"/>
          <path d="M19 7V21" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 17H21V21H3V17Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'soffit':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 12L12 4L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 10V12H20V10" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'shutters':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="18" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="7" x2="9" y2="7" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="15" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'door':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="1" stroke="currentColor" strokeWidth="2"/>
          <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
          <path d="M8 2V22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'hardware':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3C14.3 5.9 13.7 5.9 13.3 6.3L6.3 13.3C5.9 13.7 5.9 14.3 6.3 14.7L9.3 17.7C9.7 18.1 10.3 18.1 10.7 17.7L17.7 10.7C18.1 10.3 18.1 9.7 17.7 9.3L14.7 6.3Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 5L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5 19L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 22V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'placeholder':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'stairs':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 20H8V16H12V12H16V8H20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20V16H8V12H12V8H16V4H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'railing':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4" y1="8" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="8" x2="10" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="8" x2="16" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="8" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
  }
}
