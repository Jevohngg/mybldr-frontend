import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../app/providers';
import { SpecSheetTable, constructionSpecs } from '@/components/SpecSheetTable';
import Button from '../../components/ui/Button';
import styles from './Specifications.module.css';
import { breadcrumbStyles } from '@/components/Breadcrumb';

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.18,
};

// Mock data for Community specifications table
const initialCommunitySpecs = [
  { id: '1', title: 'Concrete Strength', description: 'Concrete shall have a minimum compressive strength of 4,000 psi at...' },
  { id: '2', title: 'Structural Steel Grade', description: 'All structural steel shall conform to ASTM A992, Grade 50.' },
  { id: '3', title: 'Masonry Unit Standards', description: 'Concrete masonry units (CMU) shall meet ASTM C90 standards, with...' },
  { id: '4', title: 'Ceramic Tile Flooring', description: 'Install 12"x12" porcelain ceramic tiles, meeting ANSI A137.1, with a slip...' },
  { id: '5', title: 'Carpet Flooring', description: 'Use nylon broadloom carpet, minimum 28 oz/yd², with a 10-year wear...' },
];

// Mock data for Packages table
const packagesData = [
  { id: '1', name: 'Package 1', variations: 3 },
  { id: '2', name: 'Package 2', variations: 2 },
  { id: '3', name: 'Package 3', variations: 5 },
  { id: '4', name: 'Package 4', variations: 1 },
  { id: '5', name: 'Package 5', variations: 3 },
];

// Standard specifications for sidebar
const standardSpecs = [
  { id: '1', name: 'Live.now' },
  { id: '2', name: 'Live.in' },
];

type ViewType = 'community' | 'package';
type TabType = 'base' | 'level2' | 'level3';

interface CommunitySpec {
  id: string;
  title: string;
  description: string;
}

export default function Specifications() {
  const { communityId } = useParams();
  const { communities } = useData();
  const community = communities.find((c) => c.id === communityId) || communities[0];

  const [currentView, setCurrentView] = useState<ViewType>('community');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('base');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Editable Community specs state
  const [communitySpecs, setCommunitySpecs] = useState<CommunitySpec[]>(initialCommunitySpecs);
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'title' | 'description' } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handlePackageClick = (packageName: string) => {
    setSelectedPackage(packageName);
    setCurrentView('package');
  };

  const handleBackClick = () => {
    setCurrentView('community');
    setSelectedPackage(null);
  };

  // Editable cell handlers
  const handleCellDoubleClick = useCallback((id: string, field: 'title' | 'description', currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  }, []);

  const handleCellChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      setCommunitySpecs(prev =>
        prev.map(spec =>
          spec.id === editingCell.id
            ? { ...spec, [editingCell.field]: editValue }
            : spec
        )
      );
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue]);

  const handleCellKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  }, [handleCellBlur]);

  // Community Specifications View
  if (currentView === 'community') {
    return (
      <motion.div
        className={styles.page}
        key="community"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className="h1">{community.name} Specifications</div>
        </div>

        {/* Community Section */}
        <div className={styles.card}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Community</h2>
            <Button variant="primary" size="small">
              <span className={styles.buttonContent}>
                <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                <span>Add Community Specification</span>
              </span>
            </Button>
          </div>

          {/* Toolbar - sits under section header, separate from table */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button type="button" className={styles.toolbarButton}>
                <img src="/assets/icons/search.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                <span>Search</span>
              </button>
              <button type="button" className={styles.toolbarButton}>
                <img src="/assets/icons/filter.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                <span>Filter</span>
              </button>
              <button type="button" className={styles.toolbarButton}>
                <img src="/assets/icons/sort.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {/* Inner Table Container - table + pagination with border */}
          <div className={styles.innerTableContainer}>
            {/* Community Table - Editable */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.th}>Title</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.thAction}>
                      <button type="button" className={styles.addRowButton}>
                        <img src="/assets/icons/plus-rounded.svg" alt="Add" className={styles.addIcon} draggable={false} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {communitySpecs.map((spec, index) => (
                    <tr key={spec.id} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td
                        className={styles.tdEditable}
                        onDoubleClick={() => handleCellDoubleClick(spec.id, 'title', spec.title)}
                      >
                        {editingCell?.id === spec.id && editingCell?.field === 'title' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyDown={handleCellKeyDown}
                            className={styles.editInput}
                            autoFocus
                          />
                        ) : (
                          <span className={styles.cellText}>{spec.title}</span>
                        )}
                      </td>
                      <td
                        className={styles.tdEditableDescription}
                        onDoubleClick={() => handleCellDoubleClick(spec.id, 'description', spec.description)}
                      >
                        {editingCell?.id === spec.id && editingCell?.field === 'description' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyDown={handleCellKeyDown}
                            className={styles.editInput}
                            autoFocus
                          />
                        ) : (
                          <span className={styles.cellTextDescription}>{spec.description}</span>
                        )}
                      </td>
                      <td className={styles.tdAction}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.paginationLeft}>
                <span className={styles.paginationLabel}>Rows per page:</span>
                <button type="button" className={styles.paginationDropdown}>
                  <span>5</span>
                  <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationChevron} draggable={false} />
                </button>
              </div>
              <span className={styles.paginationInfo}>1-5 of 13</span>
              <div className={styles.paginationArrows}>
                <button type="button" className={styles.paginationArrow} disabled>
                  <img src="/assets/icons/chevron-left.svg" alt="Previous" draggable={false} />
                </button>
                <button type="button" className={styles.paginationArrow}>
                  <img src="/assets/icons/chevron-right.svg" alt="Next" draggable={false} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className={styles.card}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Packages</h2>
            <div className={styles.sectionActions}>
              <Button variant="secondary" size="small">
                <span className={styles.buttonContent}>
                  <span>Import</span>
                </span>
              </Button>
              <Button variant="primary" size="small">
                <span className={styles.buttonContent}>
                  <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                  <span>Add Package</span>
                </span>
              </Button>
            </div>
          </div>

          {/* Inner Table Container - table + pagination */}
          <div className={styles.innerTableContainer}>
            {/* Packages Table - NOT Editable */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.th}>Name</th>
                    <th className={styles.thCenter}>Variations</th>
                    <th className={styles.thIconCol}>
                      <img src="/assets/icons/download.svg" alt="" className={styles.headerIcon} draggable={false} />
                    </th>
                    <th className={styles.thIconColSmall}></th>
                  </tr>
                </thead>
                <tbody>
                  {packagesData.map((pkg, index) => (
                    <tr
                      key={pkg.id}
                      className={`${index % 2 === 0 ? styles.rowEven : styles.rowOdd} ${styles.rowClickable}`}
                      onClick={() => handlePackageClick(pkg.name)}
                    >
                      <td className={styles.tdClickable}>
                        <span className={styles.packageName}>{pkg.name}</span>
                      </td>
                      <td className={styles.tdCenter}>{pkg.variations}</td>
                      <td className={styles.tdIconCol}>
                        <button
                          type="button"
                          className={styles.downloadButton}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <img src="/assets/icons/download.svg" alt="Download" className={styles.downloadIcon} draggable={false} />
                        </button>
                      </td>
                      <td className={styles.tdChevron}>
                        <img src="/assets/icons/chevron-right.svg" alt="" className={styles.rowChevron} draggable={false} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.paginationLeft}>
                <span className={styles.paginationLabel}>Rows per page:</span>
                <button type="button" className={styles.paginationDropdown}>
                  <span>5</span>
                  <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationChevron} draggable={false} />
                </button>
              </div>
              <span className={styles.paginationInfo}>1-5 of 13</span>
              <div className={styles.paginationArrows}>
                <button type="button" className={styles.paginationArrow} disabled>
                  <img src="/assets/icons/chevron-left.svg" alt="Previous" draggable={false} />
                </button>
                <button type="button" className={styles.paginationArrow}>
                  <img src="/assets/icons/chevron-right.svg" alt="Next" draggable={false} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Package Detail View
  return (
    <motion.div
      className={styles.page}
      key="package"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <div className={breadcrumbStyles.breadcrumb}>
            <button
              type="button"
              className={breadcrumbStyles.breadcrumbIconButton}
              onClick={handleBackClick}
              data-tooltip="Specifications"
            >
              <img src="/assets/icons/community.svg" alt="" className={breadcrumbStyles.breadcrumbIcon} draggable={false} />
            </button>
            <span className={breadcrumbStyles.breadcrumbSeparator}>/</span>
            <span className={breadcrumbStyles.breadcrumbCurrent}>{selectedPackage}</span>
          </div>
        </div>
        <div className={styles.detailHeaderRight}>
          <Button variant="secondary" size="small">
            <span className={styles.buttonContent}>
              <img src="/assets/icons/download.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
              <span>Export</span>
            </span>
          </Button>
          <Button variant="primary" size="small">
            <span className={styles.buttonContent}>
              <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
              <span>Import</span>
              <img src="/assets/icons/chevron-down-white.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
            </span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'base' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('base')}
          >
            Base Specs
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'level2' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('level2')}
          >
            Level 2
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'level3' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('level3')}
          >
            Level 3
          </button>
          <button type="button" className={styles.tabAdd}>
            <img src="/assets/icons/plus-rounded.svg" alt="Add level" className={styles.tabAddIcon} draggable={false} />
          </button>
        </div>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className={styles.contentLayout}>
        {/* Left: SpecSheetTable */}
        <div className={styles.mainPanel}>
          {/* Unified Table Card - contains toolbar and table */}
          <div className={styles.specTableCard}>
            {/* Toolbar */}
            <div className={styles.specToolbar}>
              <div className={styles.toolbarLeft}>
                <button type="button" className={styles.toolbarButton}>
                  <img src="/assets/icons/search.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                  <span>Search</span>
                </button>
                <button type="button" className={styles.toolbarButton}>
                  <img src="/assets/icons/filter.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                  <span>Filter</span>
                </button>
                <button type="button" className={styles.toolbarButton}>
                  <img src="/assets/icons/sort.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                  <span>Sort</span>
                </button>
              </div>
              <div className={styles.toolbarRight}>
                <button type="button" className={styles.toolbarButton}>
                  <img src="/assets/icons/columns.svg" alt="" className={styles.toolbarIcon} draggable={false} />
                  <span>Edit Columns</span>
                </button>
              </div>
            </div>
            {/* Table */}
            <div className={styles.specTableInner}>
              <SpecSheetTable data={constructionSpecs} />
            </div>
          </div>
        </div>

        {/* Right: Library Sidebar */}
        <div className={styles.sidebarPanel}>
          <div className={styles.sidebarCard}>
            {/* Library Header */}
            <div className={styles.libraryHeader}>
              <h3 className={styles.libraryTitle}>Library</h3>
            </div>

            {/* Search */}
            <div className={styles.librarySearch}>
              <img src="/assets/icons/search.svg" alt="" className={styles.searchIcon} draggable={false} />
              <input
                type="text"
                placeholder="Search your organization"
                className={styles.searchInput}
              />
            </div>

            {/* Standard Specifications Section */}
            <div className={styles.librarySection}>
              <button
                type="button"
                className={styles.librarySectionHeader}
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                <span className={styles.librarySectionTitle}>STANDARD SPECIFICATIONS</span>
                <img
                  src="/assets/icons/chevron-down.svg"
                  alt=""
                  className={`${styles.librarySectionChevron} ${sidebarExpanded ? styles.librarySectionChevronExpanded : ''}`}
                  draggable={false}
                />
              </button>
              {sidebarExpanded && (
                <div className={styles.libraryList}>
                  {standardSpecs.map((spec) => (
                    <button key={spec.id} type="button" className={styles.libraryItem}>
                      <img src="/assets/icons/live-spec.svg" alt="" className={styles.libraryItemIcon} draggable={false} />
                      <span className={styles.libraryItemText}>{spec.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
