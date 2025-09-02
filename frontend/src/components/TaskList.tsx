import React from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: string;
  onFilterChange: (filter: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusUpdate: (id: string, status: Task['status']) => Promise<Task>;
}

const TaskList: React.FC<TaskListProps> = ({ 
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
        <div style={styles.spinner} data-testid="spinner"></div>
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
          type="button"
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
  } as React.CSSProperties,
  loading: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    padding: '40px',
    color: '#666'
  } as React.CSSProperties,
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  } as React.CSSProperties,
  error: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    textAlign: 'center' as 'center'
  } as React.CSSProperties,
  errorText: {
    margin: '0 0 16px 0'
  } as React.CSSProperties,
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none' as 'none',
    borderRadius: '4px',
    cursor: 'pointer' as 'pointer'
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center' as 'center',
    padding: '40px',
    color: '#666'
  } as React.CSSProperties,
  emptyText: {
    fontSize: '18px',
    margin: 0
  } as React.CSSProperties,
  taskList: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: '12px'
  } as React.CSSProperties
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

export default TaskList;