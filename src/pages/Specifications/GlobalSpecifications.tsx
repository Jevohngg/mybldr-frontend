import { useState } from 'react';
import { motion } from 'framer-motion';
import { SpecSheetTable, globalConstructionSpecs } from '@/components/SpecSheetTable';
import styles from './GlobalSpecifications.module.css';

type FilterType = 'divisions' | 'communities' | 'lots';

interface StatCard {
  id: FilterType;
  icon: string;
  label: string;
  value: string;
}

const statCards: StatCard[] = [
  { id: 'divisions', icon: '/assets/icons/divisions.svg', label: 'Divisions', value: '8' },
  { id: 'communities', icon: '/assets/icons/communities-stat.svg', label: 'Communities', value: '23' },
  { id: 'lots', icon: '/assets/icons/lots-stat.svg', label: 'Lots', value: '96' },
];

export default function GlobalSpecifications() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('divisions');

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
        <h1 className={styles.pageTitle}>Specifications</h1>
      </div>

      {/* Stat Cards Row */}
      <div className={styles.statsRow}>
        {statCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`${styles.stat} ${activeFilter === card.id ? styles.statActive : ''}`}
            onClick={() => setActiveFilter(card.id)}
          >
            <div className={styles.statInner}>
              <div className={styles.statIconWrap}>
                <img src={card.icon} alt="" className={styles.statIcon} draggable={false} />
              </div>
              <div className={styles.statText}>
                <div className={styles.statLabel}>{card.label}</div>
                <div className={styles.statValue}>{card.value}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

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
