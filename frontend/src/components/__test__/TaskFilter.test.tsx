import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilter from '../TaskFilter';

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress', 
  COMPLETED: 'completed'
};

describe('TaskFilter Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('renders all filter buttons', () => {
    render(
      <TaskFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('calls onFilterChange when a filter is clicked', () => {
    render(
      <TaskFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
    );

    fireEvent.click(screen.getByText('Pending'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(TASK_STATUS.PENDING);

    fireEvent.click(screen.getByText('In Progress'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(TASK_STATUS.IN_PROGRESS);

    fireEvent.click(screen.getByText('Completed'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(TASK_STATUS.COMPLETED);
  });

  test('highlights the active filter button', () => {
    render(
      <TaskFilter currentFilter={TASK_STATUS.COMPLETED} onFilterChange={mockOnFilterChange} />
    );

    const activeButton = screen.getByText('Completed');
    expect(activeButton).toHaveStyle('background-color: #007bff');
    expect(activeButton).toHaveStyle('color: rgb(255, 255, 255)'); 
  });
});

