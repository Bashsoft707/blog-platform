import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { handleGraphQLErrors } from '../utils/errorHandler';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [login, { loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            localStorage.setItem('token', data.login.token);
            setIsAuthenticated(true);
            navigate('/tasks');
        },
        onError: (error) => {
            handleGraphQLErrors(error);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: { email, password } });
            localStorage.setItem('token', data.login.token);
            setIsAuthenticated(true);
            navigate('/tasks');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Need an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
