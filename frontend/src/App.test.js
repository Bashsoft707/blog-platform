import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import App, { GET_ME } from './App';

// Mock the TaskContext
jest.mock('./context/TaskContext', () => ({
  TaskProvider: ({ children }) => <div data-testid="task-provider">{children}</div>,
  useTaskContext: () => ({
    state: { tasks: [] },
    dispatch: jest.fn(),
  }),
}));

const mocks = [
  {
    request: {
      query: GET_ME,
    },
    result: {
      data: {
        me: { id: '1', username: 'testuser' },
      },
    },
  },
];

const errorMock = [
  {
    request: {
      query: GET_ME,
    },
    error: new Error('An error occurred'),
  },
];

describe('App Component', () => {
  test('renders without crashing', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <App />
        </Router>
      </MockedProvider>
    );

    // Wait for the query to resolve
    await waitFor(() => {
      expect(screen.getByTestId('task-provider')).toBeInTheDocument();
    });
  });

  test('renders loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <App />
        </Router>
      </MockedProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders content after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <App />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByTestId('task-provider')).toBeInTheDocument();
    });
  });

  test('handles authentication state', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <App />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-provider')).toBeInTheDocument();
    });

    // You can add more specific tests here for authenticated state
    // For example, checking if certain routes are available
  });

  test('handles error state', async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Router>
          <App />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(window.location.pathname).toBe('/login');
    });
  });
});
