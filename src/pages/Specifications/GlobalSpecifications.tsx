import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Templates.module.css';
import { breadcrumbStyles } from '@/components/Breadcrumb';
import { masterSpecifications } from '@/data/specifications';
import { SpecSheetTable } from '@/components/SpecSheetTable';
import BaseModal from '@/components/modals/BaseModal/BaseModal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

type ViewType = 'list' | 'detail';
type ImportStep = 'upload' | 'uploading' | 'attached';

interface Package {
  id: string;
  name: string;
  variations: number;
  usedIn: string;
}

// Initial packages data
const initialPackagesData: Package[] = [
  { id: '1', name: 'Standard', variations: 3, usedIn: 'Silver Lake' },
  { id: '2', name: 'Move Up', variations: 2, usedIn: 'Silver Lake' },
  { id: '3', name: 'Luxury', variations: 5, usedIn: 'Real Forest' },
  { id: '4', name: 'Active Adult', variations: 1, usedIn: 'Real Forest' },
  { id: '5', name: 'Townhome', variations: 3, usedIn: 'Silver Lake' },
];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.18,
};

export default function GlobalSpecifications() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>(initialPackagesData);

  // New template flow state
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);

  // Create Template modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>('upload');
  const [importProgress, setImportProgress] = useState(0);

  // Success toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsNewTemplate(false);
    setTemplateLoaded(false);
    setCurrentView('detail');
  };

  const handleBackClick = () => {
    setCurrentView('list');
    setSelectedPackage(null);
    setIsNewTemplate(false);
    setTemplateLoaded(false);
    setIsLoadingSpecs(false);
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newPkg: Package = {
      id: String(Date.now()),
      name: newTemplateName.trim(),
      variations: 0,
      usedIn: '—',
    };

    setPackages(prev => [...prev, newPkg]);
    setSelectedPackage(newPkg);
    setIsNewTemplate(true);
    setTemplateLoaded(false);
    setShowCreateModal(false);
    setNewTemplateName('');
    setCurrentView('detail');
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
      setTemplateLoaded(true);
      setIsNewTemplate(false);
      setShowSuccessToast(true);
    }, 2500);
  };

  // Show specs table when: existing template OR new template that has been loaded
  const showSpecTable = !isNewTemplate || templateLoaded;

  // Package List View
  if (currentView === 'list') {
    return (
      <>
        <motion.div
          className={styles.page}
          key="list"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className="h1">Specifications</div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setShowCreateModal(true)}
            >
              <img src="/assets/icons/plus.svg" alt="" className={styles.addButtonIcon} draggable={false} />
              <span>Add New</span>
            </button>
          </div>

          {/* Packages Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.thName}>Template</th>
                  <th className={styles.thVariations}>Variations</th>
                  <th className={styles.thUsedIn}>Used in</th>
                  <th className={styles.thActions}></th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className={styles.packageRow}
                    onClick={() => handlePackageClick(pkg)}
                  >
                    <td className={styles.tdName}>
                      <span className={styles.packageName}>{pkg.name}</span>
                    </td>
                    <td className={styles.tdVariations}>{pkg.variations}</td>
                    <td className={styles.tdUsedIn}>{pkg.usedIn}</td>
                    <td className={styles.tdChevron}>
                      <img src="/assets/icons/chevron-right.svg" alt="" className={styles.rowChevron} draggable={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Template Modal */}
        <BaseModal
          open={showCreateModal}
          title="Create Template"
          onClose={() => { setShowCreateModal(false); setNewTemplateName(''); }}
          width={480}
          footer={
            <div className={styles.footerRow}>
              <Button size="small" onClick={() => { setShowCreateModal(false); setNewTemplateName(''); }}>Cancel</Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleCreateTemplate}
                disabled={!newTemplateName.trim()}
              >
                Create
              </Button>
            </div>
          }
        >
          <div className={styles.modalField}>
            <div className="label">Template Name</div>
            <Input
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              onKeyDown={(e) => { if (e.key === 'Enter' && newTemplateName.trim()) handleCreateTemplate(); }}
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
        key="detail"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {/* Detail Header with Breadcrumb */}
        <div className={styles.detailHeader}>
          <div className={styles.detailHeaderLeft}>
            <div className={breadcrumbStyles.breadcrumb}>
              <button
                type="button"
                className={breadcrumbStyles.breadcrumbIconButton}
                onClick={handleBackClick}
                data-tooltip="Specifications"
              >
                <img src="/assets/icons/specifications.svg" alt="" className={breadcrumbStyles.breadcrumbIcon} draggable={false} />
              </button>
              <span className={breadcrumbStyles.breadcrumbSeparator}>/</span>
              <span className={breadcrumbStyles.breadcrumbCurrent}>{selectedPackage?.name}</span>
            </div>
          </div>
          <div className={styles.detailHeaderRight}>
            <button
              type="button"
              className={isNewTemplate && !templateLoaded ? styles.secondaryButtonDisabled : styles.secondaryButton}
              disabled={isNewTemplate && !templateLoaded}
            >
              <img src="/assets/icons/download.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
              <span>Export</span>
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleOpenImportModal}
            >
              <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
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
        ) : showSpecTable ? (
          <SpecSheetTable data={masterSpecifications} />
        ) : (
          <div className={styles.emptyState}>
            <img src="/assets/icons/specifications.svg" alt="" className={styles.emptyStateIcon} draggable={false} />
            <div className={styles.emptyStateTitle}>No specifications yet</div>
            <div className={styles.emptyStateDescription}>Import a spec sheet to get started.</div>
            <Button variant="primary" size="small" onClick={handleOpenImportModal} style={{ marginTop: 20 }}>
              <img src="/assets/icons/plus.svg" alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }} />
              Import
            </Button>
          </div>
        )}
      </motion.div>

      {/* Success Toast */}
      <Toast
        open={showSuccessToast}
        message="Specifications imported successfully"
        onClose={() => setShowSuccessToast(false)}
      />

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
