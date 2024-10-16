const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');
const { generateToken } = require('../utils/auth');

module.exports = {
    Query: {
        me: (_, __, { user }) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return user;
        },
    },
    Mutation: {
        register: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new UserInputError('Email already in use');
            }
            const user = await User.create({ username, email, password });
            const token = generateToken(user);
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new UserInputError('Invalid email');
            }
            const validPassword = await user.comparePassword(password);

            if (!validPassword) {
                throw new UserInputError('Invalid password');
            }
            const token = generateToken(user);
            return { token, user };
        },
    },
    User: {
        tasks: (parent) => parent.getTasks(),
    },
};
