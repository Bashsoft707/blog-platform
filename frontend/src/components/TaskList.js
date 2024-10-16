import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String) {
    createTask(title: $title, description: $description) {
      id
      title
      description
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: TaskStatus!, $title: String!, $description: String!) {
    updateTask(id: $id, status: $status, title: $title, description: $description) {
      id
      status
      title
      description
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

function TaskList() {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const { state, dispatch } = useTaskContext();
    const { loading, error, data } = useQuery(GET_TASKS);
    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);

    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_TASKS', payload: data.tasks });
        }
    }, [data, dispatch]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const { data } = await createTask({
                variables: { title: newTaskTitle, description: newTaskDescription }
            });
            dispatch({ type: 'ADD_TASK', payload: data.createTask });
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateStatus = async (task, newStatus) => {
        try {
            const { data } = await updateTask({ variables: { id: task.id, title: task.title, description: task.description, status: newStatus } });
            dispatch({ type: 'UPDATE_TASK', payload: data.updateTask });
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask({ variables: { id } });
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    if (loading) return <p className="text-center mt-8">Loading tasks...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <form onSubmit={handleCreateTask} className="mb-8">
                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New task title"
                        required
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Task description (optional)"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Add Task
                    </button>
                </div>
            </form>
            <ul className="space-y-4">
                {state.tasks.map((task) => (
                    <li key={task.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <Link to={`/tasks/${task.id}`} className="font-medium hover:text-blue-500">{task.title}</Link>
                            {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                            <select
                                value={task.status}
                                onChange={(e) => handleUpdateStatus(task, e.target.value)}
                                className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TODO">Todo</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg transition duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
