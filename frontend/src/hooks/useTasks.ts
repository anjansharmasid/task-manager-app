import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task, TaskFormData } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: string;
  setFilter: (filter: string) => void;
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskFormData) => Promise<Task>;
  updateTask: (id: string, task: TaskFormData) => Promise<Task>;
  updateStatus: (id: string, status: Task['status']) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData: TaskFormData): Promise<Task> => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, taskData: TaskFormData): Promise<Task> => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const updateStatus = async (id: string, status: Task['status']): Promise<Task> => {
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return {
    tasks: filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    fetchTasks,
    createTask,
    updateTask,
    updateStatus,
    deleteTask
  };
};