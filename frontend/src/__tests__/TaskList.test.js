import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'pending',
    dueDate: '2023-12-31T23:59:59',
    createdAt: '2023-12-01T10:30:00'
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'completed',
    dueDate: '2023-12-25T23:59:59',
    createdAt: '2023-12-01T11:30:00'
  }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnStatusUpdate = jest.fn();
const mockOnFilterChange = jest.fn();

describe('TaskList', () => {
  test('renders loading state', () => {
    render(
      <TaskList
        tasks={[]}
        loading={true}
        error={null}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to load tasks';
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error={errorMessage}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error={null}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
  });

  test('renders tasks list', () => {
    render(
      <TaskList
        tasks={mockTasks}
        loading={false}
        error={null}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });
});