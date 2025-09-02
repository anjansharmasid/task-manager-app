import React from 'react';
import { TASK_STATUS } from '../utils/constants';

interface TaskFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
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
            type="button"
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
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as 'wrap'
  } as React.CSSProperties,
  label: {
    fontWeight: 'bold' as 'bold',
    color: '#333'
  } as React.CSSProperties,
  filterGroup: {
    display: 'flex' as 'flex',
    gap: '8px',
    flexWrap: 'wrap' as 'wrap'
  } as React.CSSProperties,
  filterButton: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    color: '#333',
    borderRadius: '20px',
    cursor: 'pointer' as 'pointer',
    fontSize: '14px'
  } as React.CSSProperties,
  activeFilter: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  } as React.CSSProperties
};

export default TaskFilter;