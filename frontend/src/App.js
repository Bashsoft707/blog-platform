import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import Header from './components/Header';
import { TaskProvider } from './context/TaskContext';
import { handleGraphQLErrors } from './utils/errorHandler';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
    }
  }
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.me) {
        setIsAuthenticated(true);
      }
    },
    onError: (error) => {
      handleGraphQLErrors(error);
      setIsAuthenticated(false);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refetch();
    }
  }, [refetch]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <Header user={data?.me} setIsAuthenticated={setIsAuthenticated} />
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/tasks" /> : <Register setIsAuthenticated={setIsAuthenticated} />} />
            <Route 
              path="/tasks" 
              element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks/:id" 
              element={isAuthenticated ? <TaskDetails /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" autoClose={5000} />
      </div>
    </TaskProvider>
  );
}

export default App;
