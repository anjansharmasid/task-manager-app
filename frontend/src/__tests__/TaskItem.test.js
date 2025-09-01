import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

const mockTask = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  dueDate: '2023-12-31T23:59:59',
  createdAt: '2023-12-01T10:30:00'
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnStatusUpdate = jest.fn();

describe('TaskItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onStatusUpdate when status is changed', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.change(screen.getByDisplayValue('pending'), {
      target: { value: 'completed' }
    });

    expect(mockOnStatusUpdate).toHaveBeenCalledWith(mockTask.id, 'completed');
  });

  test('shows confirmation dialog and calls onDelete when confirmed', () => {
    window.confirm = jest.fn(() => true);
    
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });
});