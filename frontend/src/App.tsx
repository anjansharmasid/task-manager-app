import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { useTasks } from './hooks/useTasks';
import { Task } from './types/task';
import './App.css';

function App() {
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    createTask,
    updateTask,
    updateStatus,
    deleteTask
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleUpdateTask = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header style={styles.header}>
        <h1 style={styles.title}>Task Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          style={styles.addButton}
          disabled={showForm}
          type="button"
        >
          + Add New Task
        </button>
      </header>

      <main style={styles.main}>
        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancel}
          />
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          filter={filter}
          onFilterChange={setFilter}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onStatusUpdate={updateStatus}
        />
      </main>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    margin: 0,
    fontSize: '28px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px'
  }
};

export default App;