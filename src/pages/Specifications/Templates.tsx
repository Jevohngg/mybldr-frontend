import { motion } from 'framer-motion';
import { SpecSheetTable, globalConstructionSpecs } from '@/components/SpecSheetTable';
import styles from './GlobalSpecifications.module.css';

export default function Templates() {
  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
    >
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="h1">Analytics</div>
      </div>

      {/* Section Header */}
      <div className={styles.sectionHeader}>All specifications</div>

      {/* Table Section */}
      <div className={styles.tableCard}>
        {/* Toolbar */}
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
          <div className={styles.toolbarRight}>
            <button type="button" className={styles.toolbarButton}>
              <img src="/assets/icons/columns.svg" alt="" className={styles.toolbarIcon} draggable={false} />
              <span>Edit Columns</span>
            </button>
          </div>
        </div>

        {/* SpecSheetTable */}
        <div className={styles.tableContainer}>
          <SpecSheetTable data={globalConstructionSpecs} variant="global" />
        </div>
      </div>
    </motion.div>
  );
}
