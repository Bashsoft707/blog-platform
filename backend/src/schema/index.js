const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    user: User!
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createTask(title: String!, description: String): Task!
    updateTask(id: ID!, title: String, description: String, status: TaskStatus): Task!
    deleteTask(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;