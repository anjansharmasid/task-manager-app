import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';
import { TASK_STATUS } from '../../utils/constants';

const mockOnFilterChange = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn().mockResolvedValue(undefined);
const mockOnStatusUpdate = jest.fn();

const tasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: TASK_STATUS.PENDING,
    dueDate: new Date(Date.now() + 1000000).toISOString(),
    createdAt: new Date(Date.now() - 1000000).toISOString(),
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: '',
    status: TASK_STATUS.COMPLETED,
    dueDate: new Date(Date.now() + 2000000).toISOString(),
    createdAt: new Date(Date.now() - 2000000).toISOString(),
  },
];

// Save original window.location to restore after tests
const originalLocation = window.location;

describe('TaskList Component', () => {
  beforeEach(() => {
    // Override window.location with a mock object
    delete (window as any).location;
    (window as any).location = {
      reload: jest.fn(),
    };
  });

  afterEach(() => {
    // Restore original window.location after each test
    (window as any).location = originalLocation;
    jest.clearAllMocks();
  });

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
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  test('renders error state and retry button works', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error="Failed to fetch"
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
  });

  test('renders empty state when no tasks', () => {
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

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  test('renders list of tasks', () => {
    render(
      <TaskList
        tasks={tasks}
        loading={false}
        error={null}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(tasks[0].title)).toBeInTheDocument();
    expect(screen.getByText(tasks[1].title)).toBeInTheDocument();
  });

  test('calls onFilterChange when filter changes', () => {
    render(
      <TaskList
        tasks={tasks}
        loading={false}
        error={null}
        filter="all"
        onFilterChange={mockOnFilterChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );
  });
});
