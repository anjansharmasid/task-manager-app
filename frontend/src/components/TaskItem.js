import React, { useState } from 'react';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';

const TaskItem = ({ task, onEdit, onDelete, onStatusUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusUpdate(task.id, newStatus);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="task-item" style={styles.taskItem}>
      <div style={styles.taskHeader}>
        <h3 style={styles.taskTitle}>{task.title}</h3>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: STATUS_COLORS[task.status]
          }}
        >
          {task.status}
        </span>
      </div>
      
      {task.description && (
        <p style={styles.taskDescription}>{task.description}</p>
      )}
      
      <div style={styles.taskMeta}>
        <span style={styles.dueDate}>
          Due: {formatDate(task.dueDate)}
        </span>
        <span style={styles.createdAt}>
          Created: {formatDate(task.createdAt)}
        </span>
      </div>

      <div style={styles.taskActions}>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={styles.statusSelect}
        >
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </select>
        
        <button
          onClick={() => onEdit(task)}
          style={styles.editButton}
        >
          Edit
        </button>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            ...styles.deleteButton,
            opacity: isDeleting ? 0.6 : 1
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  taskItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  taskTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#333'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold'
  },
  taskDescription: {
    margin: '8px 0',
    color: '#666',
    lineHeight: '1.4'
  },
  taskMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px'
  },
  dueDate: {
    fontSize: '14px',
    color: '#666'
  },
  createdAt: {
    fontSize: '12px',
    color: '#999'
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  statusSelect: {
    padding: '6px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginRight: 'auto'
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default TaskItem;