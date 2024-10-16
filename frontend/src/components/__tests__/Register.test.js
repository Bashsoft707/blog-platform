import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import Register, { REGISTER } from '../Register';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mocks = [
    {
        request: {
            query: REGISTER,
            variables: { username: 'testuser', email: 'test@example.com', password: 'password123' },
        },
        result: {
            data: {
                register: {
                    token: 'fake-token',
                    user: { id: '1', username: 'testuser' },
                },
            },
        },
    },
];

describe('Register Component', () => {
    test('renders register form', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Register />
                </Router>
            </MockedProvider>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('submits form and registers successfully', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Register />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('fake-token');
            expect(mockNavigate).toHaveBeenCalledWith('/tasks');
        });
    });

    test('displays loading state during registration', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Router>
                    <Register />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/registering/i)).toBeInTheDocument();
    });

    test('displays error message on registration failure', async () => {
        const errorMock = {
            request: {
                query: REGISTER,
                variables: { username: 'testuser', email: 'test@example.com', password: 'password123' },
            },
            error: new Error('Registration failed'),
        };

        render(
            <MockedProvider mocks={[errorMock]} addTypename={false}>
                <Router>
                    <Register />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });
});
