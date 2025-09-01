import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  createTask: async (task) => {
    const response = await api.post('/', task);
    return response.data;
  },

  updateTask: async (id, task) => {
    const response = await api.put(`/${id}`, task);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/${id}/status?status=${status}`);
    return response.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/${id}`);
  },
};

export default taskService;