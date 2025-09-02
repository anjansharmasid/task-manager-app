export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export interface TaskService {
  getAllTasks: () => Promise<Task[]>;
  getTaskById: (id: string) => Promise<Task>;
  createTask: (task: TaskFormData) => Promise<Task>;
  updateTask: (id: string, task: TaskFormData) => Promise<Task>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}