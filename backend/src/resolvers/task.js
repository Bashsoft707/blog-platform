const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { Task } = require('../models');

module.exports = {
    Query: {
        tasks: async (_, __, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');

            return Task.findAll({ where: { userId: user.id } });
        },
        task: async (_, { id }, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');

            const task = await Task.findOne({ where: { id, userId: user.id } });

            if (!task) throw new UserInputError('Task not found');

            return task;
        },
    },
    Mutation: {
        createTask: async (_, { title, description }, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');

            if (!title) throw new UserInputError('Title is required');

            return Task.create({ title, description, userId: user.id });
        },
        updateTask: async (_, { id, title, description, status }, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');

            const task = await Task.findOne({ where: { id, userId: user.id } });

            if (!task) throw new UserInputError('Task not found');

            await task.update({ title, description, status });

            return task;
        },
        deleteTask: async (_, { id }, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');

            const task = await Task.findOne({ where: { id, userId: user.id } });

            if (!task) throw new UserInputError('Task not found');

            await task.destroy();

            return true;
        },
    },
    Task: {
        user: (parent) => parent.getUser(),
    },
};
