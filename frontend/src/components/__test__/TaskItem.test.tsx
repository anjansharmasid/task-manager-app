import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskItem from '../TaskItem';
import { Task } from '../../types/task';
import { TASK_STATUS } from '../../utils/constants';

// Mocks
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn(() => Promise.resolve());
const mockOnStatusUpdate = jest.fn((id: string, status: Task['status']) =>
  Promise.resolve({
    ...task,
    status,
  })
);

const task: Task = {
  id: '1',
  title: 'Test Task',
  description: 'A test description',
  status: TASK_STATUS.PENDING,
  dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
  createdAt: new Date().toISOString(),
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(task.description && screen.getByText(task.description)).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  test('calls onEdit when Edit button is clicked', () => {
    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(task);
  });

  test('calls onStatusUpdate when status is changed', async () => {
    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: TASK_STATUS.IN_PROGRESS },
    });

    await waitFor(() => {
      expect(mockOnStatusUpdate).toHaveBeenCalledWith(task.id, TASK_STATUS.IN_PROGRESS);
    });
  });

  test('calls onDelete when Delete is confirmed', async () => {
    // Simulate confirm dialog always returning true
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(task.id);
    });
  });

  test('does not call onDelete if confirm is cancelled', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(false);

    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  test('shows "Deleting..." while deletion is in progress', async () => {
    // Use a promise we control
    let resolvePromise: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockOnDelete.mockReturnValueOnce(deletePromise);

    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    render(
      <TaskItem
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Button should show "Deleting..."
    expect(screen.getByRole('button', { name: /deleting/i })).toBeInTheDocument();

    // Finish the promise
    resolvePromise!();

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });
  
});
