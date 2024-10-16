# Blog Platform

This is a full-stack blog platform built with React for the frontend and Node.js/Express for the backend, using GraphQL for API queries and mutations.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
   - [Cloning the Repository](#cloning-the-repository)
   - [Setting Up the Backend](#setting-up-the-backend)
   - [Setting Up the Frontend](#setting-up-the-frontend)
3. [Running the Application](#running-the-application)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Contributing](#contributing)
7. [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MySQL (v5.7 or later)

## Getting Started

### Cloning the Repository

bash
git clone https://github.com/your-username/blog-platform.git
cd blog-platform


### Setting Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_HOST=localhost
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   ```
   Replace the values with your actual database credentials and choose a secure JWT secret.

4. Set up the database:
   - Create a new MySQL database with the name you specified in the `.env` file.
   - Run the SQL scripts in the `backend/db` directory to create the necessary tables.

### Setting Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory and add the following:
   ```
   REACT_APP_API_URL=http://localhost:4000/graphql
   ```
   This assumes your backend will run on port 4000. Adjust if necessary.

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   The server should start running on `http://localhost:4000`.

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The React app should open in your default browser at `http://localhost:3000`.

## Testing

### Backend Tests

To run the backend tests:

cd backend
npm test

### Frontend Tests

To run the frontend tests:

cd frontend
npm test