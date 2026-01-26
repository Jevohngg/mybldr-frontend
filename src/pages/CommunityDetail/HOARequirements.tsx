import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { hoaRequirements, HOARequirement } from '../../mock-data/hoaRequirements';
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

export default function HOARequirements() {

  // Editable requirements state
  const [requirements, setRequirements] = useState<HOARequirement[]>(hoaRequirements);
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'title' | 'description' } | null>(null);
  const [editValue, setEditValue] = useState('');

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
      setRequirements(prev =>
        prev.map(req =>
          req.id === editingCell.id
            ? { ...req, [editingCell.field]: editValue }
            : req
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

  // Group requirements by category
  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, HOARequirement[]>);

  const categories = Object.keys(groupedRequirements);

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
        <div className="h1">HOA Requirements</div>
        <Button variant="primary">
          <span className={styles.buttonContent}>
            <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
            <span>Add Requirement</span>
          </span>
        </Button>
      </div>

      {/* Requirements by Category */}
      {categories.map((category) => (
        <div key={category} className={styles.card}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{category}</h2>
          </div>

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

          {/* Inner Table Container */}
          <div className={styles.innerTableContainer}>
            {/* Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.th} style={{ width: '30%' }}>Title</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.thAction}>
                      <button type="button" className={styles.addRowButton}>
                        <img src="/assets/icons/plus-rounded.svg" alt="Add" className={styles.addIcon} draggable={false} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedRequirements[category].map((req, index) => (
                    <tr key={req.id} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td
                        className={styles.tdEditable}
                        onDoubleClick={() => handleCellDoubleClick(req.id, 'title', req.title)}
                      >
                        {editingCell?.id === req.id && editingCell?.field === 'title' ? (
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
                          <span className={styles.cellText}>{req.title}</span>
                        )}
                      </td>
                      <td
                        className={styles.tdEditableDescription}
                        onDoubleClick={() => handleCellDoubleClick(req.id, 'description', req.description)}
                      >
                        {editingCell?.id === req.id && editingCell?.field === 'description' ? (
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
                          <span className={styles.cellTextDescription}>{req.description}</span>
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
              <span className={styles.paginationInfo}>1-{Math.min(5, groupedRequirements[category].length)} of {groupedRequirements[category].length}</span>
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
      ))}
    </motion.div>
  );
}
