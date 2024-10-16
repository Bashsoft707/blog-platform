import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Login, { LOGIN } from '../Login';

const mockNavigate = jest.fn();
const mockSetIsAuthenticated = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mocks = [
    {
        request: {
            query: LOGIN,
            variables: { email: 'test@example.com', password: 'password123' },
        },
        result: {
            data: {
                login: {
                    token: 'fake-token',
                    user: { id: '1', username: 'testuser' },
                },
            },
        },
    },
];

describe('Login Component', () => {
    test('renders login form', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Login setIsAuthenticated={mockSetIsAuthenticated} />
                </Router>
            </MockedProvider>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText(/need an account/i)).toBeInTheDocument();
    });

    test('submits form and logs in successfully', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Login setIsAuthenticated={mockSetIsAuthenticated} />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('fake-token');
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
            expect(mockNavigate).toHaveBeenCalledWith('/tasks');
        });
    });

    test('displays loading state during login', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Login setIsAuthenticated={mockSetIsAuthenticated} />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        
        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);

        // Check if the button is disabled during the loading state
        expect(loginButton).toBeDisabled();

        // Wait for the loading state to finish
        await waitFor(() => {
            expect(loginButton).not.toBeDisabled();
        });
    });
});
