import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../app/providers';
import { SpecSheetTable } from '@/components/SpecSheetTable';
import { masterSpecifications } from '@/data/specifications';
import Button from '../../components/ui/Button';
import BaseModal from '../../components/modals/BaseModal/BaseModal';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
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

// Initial templates data
const initialPackagesData = [
  { id: '1', name: 'Standard', variations: 3 },
  { id: '2', name: 'Move Up', variations: 2 },
  { id: '3', name: 'Luxury', variations: 5 },
  { id: '4', name: 'Active Adult', variations: 1 },
  { id: '5', name: 'Townhome', variations: 3 },
];

// All available templates for standard specifications sidebar
const allTemplates = [
  { id: '1', name: 'Standard' },
  { id: '2', name: 'Move Up' },
  { id: '3', name: 'Luxury' },
  { id: '4', name: 'Active Adult' },
  { id: '5', name: 'Townhome' },
];

type ViewType = 'community' | 'package';
type ImportStep = 'upload' | 'uploading' | 'attached';

interface CommunitySpec {
  id: string;
  title: string;
  description: string;
}

interface PackageItem {
  id: string;
  name: string;
  variations: number;
}

export default function Specifications() {
  const { communityId } = useParams();
  const { communities } = useData();
  const community = communities.find((c) => c.id === communityId) || communities[0];

  const [currentView, setCurrentView] = useState<ViewType>('community');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Editable Community specs state
  const [communitySpecs, setCommunitySpecs] = useState<CommunitySpec[]>(initialCommunitySpecs);
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'title' | 'description' } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newRowId, setNewRowId] = useState<string | null>(null);

  // Community table pagination
  const [communityPage, setCommunityPage] = useState(0);
  const communityRowsPerPage = 5;
  const communityTotalPages = Math.ceil(communitySpecs.length / communityRowsPerPage);
  const communityStartIndex = communityPage * communityRowsPerPage;
  const communityEndIndex = Math.min(communityStartIndex + communityRowsPerPage, communitySpecs.length);
  const paginatedCommunitySpecs = communitySpecs.slice(communityStartIndex, communityEndIndex);

  // Packages state
  const [packages, setPackages] = useState<PackageItem[]>(initialPackagesData);

  // Packages table pagination
  const [packagesPage, setPackagesPage] = useState(0);
  const packagesRowsPerPage = 5;
  const packagesTotalPages = Math.ceil(packages.length / packagesRowsPerPage);
  const packagesStartIndex = packagesPage * packagesRowsPerPage;
  const packagesEndIndex = Math.min(packagesStartIndex + packagesRowsPerPage, packages.length);
  const paginatedPackages = packages.slice(packagesStartIndex, packagesEndIndex);

  // New package flow state
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [packageLoaded, setPackageLoaded] = useState(false);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);

  // Create Package modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPackageName, setNewPackageName] = useState('');

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>('upload');
  const [importProgress, setImportProgress] = useState(0);

  // Success toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedTemplate, setDraggedTemplate] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [templateToImport, setTemplateToImport] = useState<string | null>(null);

  // Handle import progress animation
  useEffect(() => {
    if (importStep !== 'uploading') return;

    setImportProgress(0);
    const duration = 2500;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setImportProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [importStep]);

  // Transition from uploading to attached when progress completes
  useEffect(() => {
    if (importProgress >= 100 && importStep === 'uploading') {
      const timer = setTimeout(() => {
        setImportStep('attached');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [importProgress, importStep]);

  const handlePackageClick = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsNewPackage(false);
    setPackageLoaded(false);
    setCurrentView('package');
  };

  const handleBackClick = () => {
    setCurrentView('community');
    setSelectedPackage(null);
    setIsNewPackage(false);
    setPackageLoaded(false);
    setIsLoadingSpecs(false);
  };

  const handleCreatePackage = () => {
    if (!newPackageName.trim()) return;

    const newPkg: PackageItem = {
      id: String(Date.now()),
      name: newPackageName.trim(),
      variations: 0,
    };

    setPackages(prev => [newPkg, ...prev]);
    setPackagesPage(0);
    setSelectedPackage(newPkg.name);
    setIsNewPackage(true);
    setPackageLoaded(false);
    setShowCreateModal(false);
    setNewPackageName('');
    setCurrentView('package');
  };

  const handleOpenImportModal = () => {
    setImportStep('upload');
    setImportProgress(0);
    setShowImportModal(true);
  };

  const handleImportUpload = () => {
    setImportStep('uploading');
  };

  const handleImportConfirm = () => {
    setShowImportModal(false);
    setIsLoadingSpecs(true);

    setTimeout(() => {
      setIsLoadingSpecs(false);
      setPackageLoaded(true);
      setIsNewPackage(false);
      setShowSuccessToast(true);
    }, 2500);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, templateName: string) => {
    setIsDragging(true);
    setDraggedTemplate(templateName);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', templateName);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
    setDraggedTemplate(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set isDragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsDragging(false);

    const templateName = e.dataTransfer.getData('text/plain');
    if (templateName) {
      setTemplateToImport(templateName);
      setShowConfirmModal(true);
    }
    setDraggedTemplate(null);
  };

  const handleConfirmImport = () => {
    setShowConfirmModal(false);
    setTemplateToImport(null);
    setIsLoadingSpecs(true);

    setTimeout(() => {
      setIsLoadingSpecs(false);
      setPackageLoaded(true);
      setIsNewPackage(false);
      setShowSuccessToast(true);
    }, 2500);
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
      if (editingCell.id === newRowId) {
        setNewRowId(null);
      }
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue, newRowId]);

  const handleCellKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (editingCell && editingCell.field === 'title' && editingCell.id === newRowId) {
        // Save title and move to description for new rows
        e.preventDefault();
        setCommunitySpecs(prev =>
          prev.map(spec =>
            spec.id === editingCell.id
              ? { ...spec, title: editValue }
              : spec
          )
        );
        setEditingCell({ id: editingCell.id, field: 'description' });
        setEditValue('');
      } else {
        handleCellBlur();
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  }, [handleCellBlur, editingCell, newRowId, editValue]);

  const handleAddCommunitySpec = useCallback(() => {
    const id = `new-${Date.now()}`;
    const newSpec: CommunitySpec = { id, title: '', description: '' };
    setCommunitySpecs(prev => [newSpec, ...prev]);
    setCommunityPage(0);
    setNewRowId(id);
    setEditingCell({ id, field: 'title' });
    setEditValue('');
  }, []);

  // Show specs table when: existing package OR new package that has been loaded
  const showSpecTable = !isNewPackage || packageLoaded;

  // Community Specifications View
  if (currentView === 'community') {
    return (
      <>
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
            <div className="h1">Specifications</div>
          </div>

          {/* Community Section */}
          <div className={styles.card}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Community</h2>
              <Button variant="primary" size="small" onClick={handleAddCommunitySpec}>
                <span className={styles.buttonContent}>
                  <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                  <span>Add Community Specification</span>
                </span>
              </Button>
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
                      <th className={styles.thAction}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCommunitySpecs.map((spec, index) => (
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
                    <span>{communityRowsPerPage}</span>
                    <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationChevron} draggable={false} />
                  </button>
                </div>
                <span className={styles.paginationInfo}>
                  {communitySpecs.length === 0
                    ? '0 of 0'
                    : `${communityStartIndex + 1}-${communityEndIndex} of ${communitySpecs.length}`}
                </span>
                <div className={styles.paginationArrows}>
                  <button
                    type="button"
                    className={styles.paginationArrow}
                    disabled={communityPage === 0}
                    onClick={() => setCommunityPage(prev => prev - 1)}
                  >
                    <img src="/assets/icons/chevron-left.svg" alt="Previous" draggable={false} />
                  </button>
                  <button
                    type="button"
                    className={styles.paginationArrow}
                    disabled={communityPage >= communityTotalPages - 1}
                    onClick={() => setCommunityPage(prev => prev + 1)}
                  >
                    <img src="/assets/icons/chevron-right.svg" alt="Next" draggable={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Section */}
          <div className={styles.card}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Templates</h2>
              <div className={styles.sectionActions}>
                <Button variant="secondary" size="small">
                  <span className={styles.buttonContent}>
                    <span>Import</span>
                  </span>
                </Button>
                <Button variant="primary" size="small" onClick={() => setShowCreateModal(true)}>
                  <span className={styles.buttonContent}>
                    <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                    <span>Add Template</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Inner Table Container - table + pagination */}
            <div className={styles.innerTableContainer}>
              {/* Templates Table - NOT Editable */}
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
                    {paginatedPackages.map((pkg, index) => (
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
                    <span>{packagesRowsPerPage}</span>
                    <img src="/assets/icons/chevron-down.svg" alt="" className={styles.paginationChevron} draggable={false} />
                  </button>
                </div>
                <span className={styles.paginationInfo}>
                  {packages.length === 0
                    ? '0 of 0'
                    : `${packagesStartIndex + 1}-${packagesEndIndex} of ${packages.length}`}
                </span>
                <div className={styles.paginationArrows}>
                  <button
                    type="button"
                    className={styles.paginationArrow}
                    disabled={packagesPage === 0}
                    onClick={() => setPackagesPage(prev => prev - 1)}
                  >
                    <img src="/assets/icons/chevron-left.svg" alt="Previous" draggable={false} />
                  </button>
                  <button
                    type="button"
                    className={styles.paginationArrow}
                    disabled={packagesPage >= packagesTotalPages - 1}
                    onClick={() => setPackagesPage(prev => prev + 1)}
                  >
                    <img src="/assets/icons/chevron-right.svg" alt="Next" draggable={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Create Template Modal */}
        <BaseModal
          open={showCreateModal}
          title="Add Template"
          onClose={() => { setShowCreateModal(false); setNewPackageName(''); }}
          width={480}
          footer={
            <div className={styles.footerRow}>
              <Button size="small" onClick={() => { setShowCreateModal(false); setNewPackageName(''); }}>Cancel</Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleCreatePackage}
                disabled={!newPackageName.trim()}
              >
                Create
              </Button>
            </div>
          }
        >
          <div className={styles.modalField}>
            <div className="label">Template Name</div>
            <Input
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              placeholder="Enter template name"
              onKeyDown={(e) => { if (e.key === 'Enter' && newPackageName.trim()) handleCreatePackage(); }}
            />
          </div>
        </BaseModal>
      </>
    );
  }

  // Package Detail View
  return (
    <>
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
            <Button
              variant="secondary"
              size="small"
              className={isNewPackage && !packageLoaded ? styles.buttonDisabled : undefined}
              disabled={isNewPackage && !packageLoaded}
            >
              <span className={styles.buttonContent}>
                <img src="/assets/icons/download.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                <span>Export</span>
              </span>
            </Button>
            <Button variant="primary" size="small" onClick={handleOpenImportModal}>
              <span className={styles.buttonContent}>
                <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
                <span>Import</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoadingSpecs ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}>
              <svg className={styles.loadingSpinnerSvg} viewBox="0 0 50 50">
                <circle className={styles.loadingSpinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
              </svg>
            </div>
            <div className={styles.loadingText}>Importing specifications...</div>
            <div className={styles.loadingSubtext}>Analyzing and organizing your spec sheet</div>
          </div>
        ) : (
          <div className={styles.contentLayout}>
            {/* Left: Empty State or SpecSheetTable */}
            {showSpecTable ? (
              <SpecSheetTable data={masterSpecifications} />
            ) : (
              <div
                className={`${styles.emptyState} ${isDragOver ? styles.emptyStateDragOver : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragOver ? (
                  <>
                    <img src="/assets/icons/upload.svg" alt="" className={styles.emptyStateIcon} draggable={false} style={{ opacity: 0.5 }} />
                    <div className={styles.emptyStateTitle}>Drop to import template</div>
                    <div className={styles.emptyStateDescription}>Release to import specifications from {draggedTemplate}</div>
                  </>
                ) : (
                  <>
                    <img src="/assets/icons/specifications.svg" alt="" className={styles.emptyStateIcon} draggable={false} />
                    <div className={styles.emptyStateTitle}>No specifications yet</div>
                    <div className={styles.emptyStateDescription}>Drag a template from the library or import a spec sheet to get started.</div>
                    <Button variant="primary" size="small" onClick={handleOpenImportModal}>
                      <img src="/assets/icons/plus.svg" alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }} />
                      Import
                    </Button>
                  </>
                )}
              </div>
            )}

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

                {/* Templates Section */}
                <div className={styles.librarySection}>
                  <button
                    type="button"
                    className={styles.librarySectionHeader}
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  >
                    <span className={styles.librarySectionTitle}>TEMPLATES</span>
                    <img
                      src="/assets/icons/chevron-down.svg"
                      alt=""
                      className={`${styles.librarySectionChevron} ${sidebarExpanded ? styles.librarySectionChevronExpanded : ''}`}
                      draggable={false}
                    />
                  </button>
                  {sidebarExpanded && (
                    <div className={styles.libraryList}>
                      {allTemplates.map((spec) => (
                        <button
                          key={spec.id}
                          type="button"
                          className={styles.libraryItem}
                          draggable={!showSpecTable}
                          onDragStart={(e) => handleDragStart(e, spec.name)}
                          onDragEnd={handleDragEnd}
                          style={{ cursor: !showSpecTable ? 'grab' : 'pointer' }}
                        >
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
        )}
      </motion.div>

      {/* Success Toast */}
      <Toast
        open={showSuccessToast}
        message="Specifications imported successfully"
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Confirm Template Import Modal */}
      <BaseModal
        open={showConfirmModal}
        title="Import Template Specifications"
        onClose={() => { setShowConfirmModal(false); setTemplateToImport(null); }}
        width={480}
        footer={
          <div className={styles.footerRow}>
            <Button size="small" onClick={() => { setShowConfirmModal(false); setTemplateToImport(null); }}>Cancel</Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleConfirmImport}
            >
              Import
            </Button>
          </div>
        }
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#3E4041', margin: 0 }}>
            Are you sure you want to import all specifications from the <strong>{templateToImport}</strong> template?
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6B7280', margin: '12px 0 0 0' }}>
            This will populate your current template with all specifications from {templateToImport}.
          </p>
        </div>
      </BaseModal>

      {/* Import Specs Modal */}
      <BaseModal
        open={showImportModal}
        title="Import Specifications"
        onClose={() => setShowImportModal(false)}
        width={560}
        footer={
          importStep === 'attached' ? (
            <div className={styles.footerRow}>
              <Button onClick={() => setShowImportModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleImportConfirm}>Import</Button>
            </div>
          ) : undefined
        }
      >
        {importStep === 'upload' && (
          <div className={styles.uploadArea}>
            <div className={styles.uploadAreaInner}>
              <img src="/assets/upload-hero.png" alt="" className={styles.uploadHeroIcon} />
              <div className={styles.uploadTitle}>Upload your spec sheet</div>
              <div className={styles.uploadDescription}>
                Upload a PDF or spreadsheet and we'll extract your specifications automatically.
              </div>
              <Button variant="primary" onClick={handleImportUpload}>Upload</Button>
            </div>
          </div>
        )}

        {importStep === 'uploading' && (
          <div className={styles.uploadingState}>
            <div className={styles.uploadingTitle}>Processing spec sheet</div>
            <div className={styles.uploadingSubtext}>Analyzing your document...</div>
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${importProgress}%` }} />
              </div>
              <div className={styles.progressLabel}>{Math.round(importProgress)}%</div>
            </div>
            <div className={styles.fileRow}>
              <div className={styles.fileLeft}>
                <img src="/assets/pdf.png" alt="PDF" className={styles.pdfIcon} />
                <div>
                  <div className={styles.fileName}>specifications.pdf</div>
                  <div className={styles.fileSize}>100kb</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {importStep === 'attached' && (
          <div>
            <div className={styles.fileRow}>
              <div className={styles.fileLeft}>
                <img src="/assets/pdf.png" alt="PDF" className={styles.pdfIcon} />
                <div>
                  <div className={styles.fileName}>specifications.pdf</div>
                  <div className={styles.fileSize}>100kb</div>
                </div>
              </div>
              <Button onClick={() => { setImportStep('upload'); setImportProgress(0); }}>Update</Button>
            </div>
          </div>
        )}
      </BaseModal>
    </>
  );
}
