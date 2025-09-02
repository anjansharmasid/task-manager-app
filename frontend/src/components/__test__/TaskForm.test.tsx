import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../TaskForm';
import { TASK_STATUS } from '../../utils/constants';
import { Task } from '../../types/task';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn(() => Promise.resolve());
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders empty form in create mode', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/status/i)).toHaveValue(TASK_STATUS.PENDING);
    expect(screen.getByLabelText(/due date/i)).toHaveValue('');
  });

  test('renders form with task data in edit mode', () => {
   const task: Task = {
   id: '1',
   title: 'Test Task',
   description: 'Test Description',
   status: TASK_STATUS.IN_PROGRESS,
   //dueDate: new Date(Date.now() + 3600000).toISOString(),
   dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
   createdAt: new Date().toISOString()}


    render(<TaskForm task={task} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue(task.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(task.description);
    expect(screen.getByLabelText(/status/i)).toHaveValue(task.status);
  });

  test('shows validation errors when required fields are invalid', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Due date is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  
  test('calls onSubmit with valid data', async () => {
  render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Task' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Details here' } });
  fireEvent.change(screen.getByLabelText(/status/i), {
    target: { value: TASK_STATUS.COMPLETED },
  });

  // Ensure the due date is clearly in the future (e.g., 1 day ahead)
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16); 
  fireEvent.change(screen.getByLabelText(/due date/i), {
    target: { value: futureDate },
  });

  fireEvent.click(screen.getByRole('button', { name: /create task/i }));

  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalled(); // Ensure it was called

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'My Task',
        description: 'Details here',
        status: TASK_STATUS.COMPLETED,
        dueDate: expect.any(String), // will be ISO string
      })
    );
  });
 });


  test('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
