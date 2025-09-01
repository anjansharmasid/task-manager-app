import React from 'react';
import { TASK_STATUS } from '../utils/constants';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: TASK_STATUS.PENDING, label: 'Pending' },
    { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: TASK_STATUS.COMPLETED, label: 'Completed' }
  ];

  return (
    <div style={styles.container}>
      <span style={styles.label}>Filter by status:</span>
      <div style={styles.filterGroup}>
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            style={{
              ...styles.filterButton,
              ...(currentFilter === filter.value ? styles.activeFilter : {})
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  label: {
    fontWeight: '600',
    color: '#333'
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    color: '#333',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeFilter: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  }
};

export default TaskFilter;