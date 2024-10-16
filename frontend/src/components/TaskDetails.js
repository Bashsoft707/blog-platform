import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
    }
  }
`;

function TaskDetails() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_TASK, { variables: { id } });

    if (loading) return <p className="text-center mt-8">Loading task details...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;

    const { task } = data;

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
            <p className="text-gray-600 mb-4">{task.description || 'No description provided.'}</p>
            <p className="mb-4">
                <span className="font-semibold">Status:</span> {task.status}
            </p>
            <Link
                to="/tasks"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Back to Task List
            </Link>
        </div>
    );
}

export default TaskDetails;