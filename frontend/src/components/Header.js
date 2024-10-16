import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header({ user, setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            navigate('/login');
            toast.success('Logged out successfully', {
                position: "bottom-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Task Manager</h1>
                <nav>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Welcome, {user.username}!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-300 disabled:opacity-50"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition duration-300">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
