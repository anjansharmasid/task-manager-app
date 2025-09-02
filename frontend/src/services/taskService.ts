import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { Task, TaskFormData, TaskService } from '../types/task';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService: TaskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/');
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/${id}`);
    return response.data;
  },

  createTask: async (task: TaskFormData): Promise<Task> => {
    const response = await api.post<Task>('/', task);
    return response.data;
  },

  updateTask: async (id: string, task: TaskFormData): Promise<Task> => {
    const response = await api.put<Task>(`/${id}`, task);
    return response.data;
  },

  updateTaskStatus: async (id: string, status: Task['status']): Promise<Task> => {
    const response = await api.patch<Task>(`/${id}/status?status=${status}`);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};