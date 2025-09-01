import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create form correctly', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date *')).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Create Task'));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Due date is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dateString = futureDate.toISOString().slice(0, 16);

    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' }
    });
    fireEvent.change(screen.getByLabelText('Due Date *'), {
      target: { value: dateString }
    });

    fireEvent.click(screen.getByText('Create Task'));

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});