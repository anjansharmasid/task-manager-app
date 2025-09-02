import React, { useState } from 'react';
import { Task } from '../types/task';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusUpdate: (id: string, status: Task['status']) => Promise<Task>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusUpdate }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await onStatusUpdate(task.id, newStatus);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Define styles with proper TypeScript types
  const styles = {
    taskItem: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    } as React.CSSProperties,
    taskHeader: {
      display: 'flex' as 'flex',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',
      marginBottom: '12px'
    } as React.CSSProperties,
    taskTitle: {
      margin: 0,
      fontSize: '18px',
      color: '#333'
    } as React.CSSProperties,
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      color: 'white',
      fontWeight: 'bold' as 'bold'
    } as React.CSSProperties,
    taskDescription: {
      margin: '8px 0',
      color: '#666',
      lineHeight: 1.4
    } as React.CSSProperties,
    taskMeta: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      gap: '4px',
      marginBottom: '12px'
    } as React.CSSProperties,
    dueDate: {
      fontSize: '14px',
      color: '#666'
    } as React.CSSProperties,
    createdAt: {
      fontSize: '12px',
      color: '#999'
    } as React.CSSProperties,
    taskActions: {
      display: 'flex' as 'flex',
      gap: '8px',
      alignItems: 'center' as 'center'
    } as React.CSSProperties,
    statusSelect: {
      padding: '6px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginRight: 'auto'
    } as React.CSSProperties,
    editButton: {
      padding: '6px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none' as 'none',
      borderRadius: '4px',
      cursor: 'pointer' as 'pointer'
    } as React.CSSProperties,
    deleteButton: {
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none' as 'none',
      borderRadius: '4px',
      cursor: 'pointer' as 'pointer'
    } as React.CSSProperties
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
          onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
          style={styles.statusSelect}
        >
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </select>
        
        <button
          onClick={() => onEdit(task)}
          style={styles.editButton}
          type="button"
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
          type="button"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;