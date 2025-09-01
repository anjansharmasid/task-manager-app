export const API_BASE_URL = 'http://localhost:8080/v1/api/tasks';
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

export const STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: 'Pending' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: TASK_STATUS.COMPLETED, label: 'Completed' }
];

export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: '#ffc107',
  [TASK_STATUS.IN_PROGRESS]: '#17a2b8',
  [TASK_STATUS.COMPLETED]: '#28a745'
};