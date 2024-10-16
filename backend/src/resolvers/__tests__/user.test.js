const { AuthenticationError, UserInputError } = require('apollo-server-express');
const userResolvers = require('../user');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');

jest.mock('../../models');
jest.mock('../../utils/auth');

describe('User Resolvers', () => {
    describe('Query', () => {
        test('me should return user if authenticated', async () => {
            const mockUser = { id: '123', username: 'testuser' };
            const result = await userResolvers.Query.me(null, null, { user: mockUser });
            expect(result).toEqual(mockUser);
        });

        test('me should throw AuthenticationError if not authenticated', async () => {
            await expect(async () => {
                await userResolvers.Query.me(null, null, { user: null });
            }).rejects.toThrow(AuthenticationError);
        });
    });

    describe('Mutation', () => {
        test('login should return token and user for valid credentials', async () => {
            const mockUser = { id: '123', username: 'testuser', email: 'test@example.com' };
            const mockToken = 'mockToken';
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword = jest.fn().mockResolvedValue(true);
            generateToken.mockReturnValue(mockToken);

            const result = await userResolvers.Mutation.login(null, { email: 'test@example.com', password: 'password' });
            expect(result).toEqual({ token: mockToken, user: mockUser });
        });

        test('login should throw UserInputError for invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);
            await expect(async () => {
                await userResolvers.Mutation.login(null, { email: 'test@example.com', password: 'password' });
            }).rejects.toThrow(UserInputError);
        });
    });
});
