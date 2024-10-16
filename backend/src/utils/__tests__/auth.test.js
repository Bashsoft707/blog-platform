const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { generateToken, authenticate, JWT_SECRET } = require('../auth');

jest.mock('jsonwebtoken');
jest.mock('../../models');

describe('Auth Utilities', () => {
    const mockUser = { id: '123' };
    const mockToken = 'mockToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateToken should create a token', () => {
        jwt.sign.mockReturnValue(mockToken);
        const token = generateToken(mockUser);
        expect(token).toBe(mockToken);
        expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, JWT_SECRET, { expiresIn: '1d' });
    });

    test('authenticate should return user for valid token', async () => {
        jwt.verify.mockReturnValue({ id: mockUser.id });
        User.findByPk.mockResolvedValue(mockUser);

        const user = await authenticate(`Bearer ${mockToken}`);
        expect(user).toEqual(mockUser);
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
        expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
    });

    test('authenticate should return null for invalid token', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const user = await authenticate(`Bearer ${mockToken}`);
        expect(user).toBeNull();
    });

    test('authenticate should return null for missing token', async () => {
        const user = await authenticate(null);
        expect(user).toBeNull();
    });
});
