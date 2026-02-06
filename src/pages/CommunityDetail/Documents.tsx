import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { communityDocuments, Document } from '../../mock-data/documents';
import styles from './Specifications.module.css';

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.18,
};

export default function Documents() {
  const handleDownload = (doc: Document) => {
    // Placeholder for download functionality
    console.log('Downloading:', doc.name);
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="h1">Documents</div>
        <Button variant="primary">
          <span className={styles.buttonContent}>
            <img src="/assets/icons/upload-white.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
            <span>Upload</span>
          </span>
        </Button>
      </div>

      {/* Documents Section */}
      <div className={styles.card}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Community Documents</h2>
        </div>

        {/* Inner Table Container */}
        <div className={styles.innerTableContainer}>
          {/* Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.th}>Name</th>
                  <th className={styles.thCenter} style={{ width: '100px' }}>Size</th>
                  <th className={styles.thIconCol}></th>
                </tr>
              </thead>
              <tbody>
                {communityDocuments.map((doc, index) => (
                  <tr key={doc.id} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td className={styles.tdClickable}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src="/assets/pdf.png"
                          alt="PDF"
                          style={{ width: '24px', height: '24px', flexShrink: 0 }}
                          draggable={false}
                        />
                        <span className={styles.packageName}>{doc.name}</span>
                      </div>
                    </td>
                    <td className={styles.tdCenter}>{doc.size}</td>
                    <td className={styles.tdIconCol}>
                      <button
                        type="button"
                        className={styles.downloadButton}
                        onClick={() => handleDownload(doc)}
                      >
                        <img src="/assets/icons/download.svg" alt="Download" className={styles.downloadIcon} draggable={false} />
                      </button>
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
            <span className={styles.paginationInfo}>1-{communityDocuments.length} of {communityDocuments.length}</span>
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
