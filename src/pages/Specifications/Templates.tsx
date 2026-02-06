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
        <div className="h1">Summary</div>
      </div>

      {/* Section Header */}
      <div className={styles.sectionHeader}>All specifications</div>

      {/* SpecSheetTable */}
      <SpecSheetTable data={globalConstructionSpecs} variant="global" />
    </motion.div>
  );
}
