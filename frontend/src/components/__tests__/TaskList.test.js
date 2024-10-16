import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { TaskProvider } from '../../context/TaskContext';
import TaskList, { GET_TASKS, CREATE_TASK, UPDATE_TASK, DELETE_TASK } from '../TaskList';

const mocks = [
  {
    request: {
      query: GET_TASKS,
    },
    result: {
      data: {
        tasks: [
          { id: '1', title: 'Task 1', description: 'Description 1', status: 'TODO' },
          { id: '2', title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS' },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_TASK,
      variables: { title: 'New Task', description: 'New Description' },
    },
    result: {
      data: {
        createTask: { id: '3', title: 'New Task', description: 'New Description', status: 'TODO' },
      },
    },
  },
  {
    request: {
      query: UPDATE_TASK,
      variables: { id: '1', title: 'Task 1', description: 'Description 1', status: 'IN_PROGRESS' },
    },
    result: {
      data: {
        updateTask: { id: '1', title: 'Task 1', description: 'Description 1', status: 'IN_PROGRESS' },
      },
    },
  },
  {
    request: {
      query: DELETE_TASK,
      variables: { id: '2' },
    },
    result: {
      data: {
        deleteTask: true,
      },
    },
  },
];

const MockTaskList = () => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <TaskProvider>
      <Router>
        <TaskList />
      </Router>
    </TaskProvider>
  </MockedProvider>
);

describe('TaskList Component', () => {
  test('renders task list and performs CRUD operations', async () => {
    render(<MockTaskList />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // Create a new task
    fireEvent.change(screen.getByPlaceholderText('New task title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByPlaceholderText('Task description (optional)'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByText('Add Task'));

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    // Update task status
    const selectElement = screen.getAllByRole('combobox')[0];
    fireEvent.change(selectElement, { target: { value: 'IN_PROGRESS' } });

    await waitFor(() => {
      expect(selectElement.value).toBe('IN_PROGRESS');
    });

    // Delete a task
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[1]); // Delete the second task

    await waitFor(() => {
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  });
});
