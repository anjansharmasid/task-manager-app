import React from 'react';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';

const TaskList = ({ 
  tasks, 
  loading, 
  error, 
  filter, 
  onFilterChange, 
  onEdit, 
  onDelete, 
  onStatusUpdate 
}) => {
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p style={styles.errorText}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TaskFilter
        currentFilter={filter}
        onFilterChange={onFilterChange}
      />

      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>
            {filter === 'all' 
              ? 'No tasks found. Create your first task!'
              : `No ${filter} tasks found.`
            }
          </p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#666'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  error: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    textAlign: 'center'
  },
  errorText: {
    margin: '0 0 16px 0'
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  emptyText: {
    fontSize: '18px',
    margin: 0
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default TaskList;