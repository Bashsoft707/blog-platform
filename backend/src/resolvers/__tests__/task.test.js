const { AuthenticationError, UserInputError } = require('apollo-server-express');
const taskResolvers = require('../task');
const { Task } = require('../../models');

jest.mock('../../models');

describe('Task Resolvers', () => {
    const mockUser = { id: 'user1' };
    const mockContext = { user: mockUser };

    describe('Query', () => {
        test('tasks should return all tasks for authenticated user', async () => {
            const mockTasks = [
                { id: '1', title: 'Task 1', userId: 'user1' },
                { id: '2', title: 'Task 2', userId: 'user1' },
            ];
            Task.findAll.mockResolvedValue(mockTasks);

            const result = await taskResolvers.Query.tasks(null, null, mockContext);
            expect(result).toEqual(mockTasks);
            expect(Task.findAll).toHaveBeenCalledWith({ where: { userId: 'user1' } });
        });

        test('tasks should throw AuthenticationError if not authenticated', async () => {
            await expect(taskResolvers.Query.tasks(null, null, { user: null }))
                .rejects.toThrow(AuthenticationError);
        });

        test('task should return a specific task for authenticated user', async () => {
            const mockTask = { id: '1', title: 'Task 1', userId: 'user1' };
            Task.findOne.mockResolvedValue(mockTask);

            const result = await taskResolvers.Query.task(null, { id: '1' }, mockContext);
            expect(result).toEqual(mockTask);
            expect(Task.findOne).toHaveBeenCalledWith({ where: { id: '1', userId: 'user1' } });
        });

        test('task should throw UserInputError if task not found', async () => {
            Task.findOne.mockResolvedValue(null);

            await expect(taskResolvers.Query.task(null, { id: '1' }, mockContext))
                .rejects.toThrow(UserInputError);
        });
    });

    describe('Mutation', () => {
        test('createTask should create and return a new task', async () => {
            const mockTask = { id: '1', title: 'New Task', userId: 'user1' };
            Task.create.mockResolvedValue(mockTask);

            const result = await taskResolvers.Mutation.createTask(null, { title: 'New Task' }, mockContext);
            expect(result).toEqual(mockTask);
            expect(Task.create).toHaveBeenCalledWith({ title: 'New Task', userId: 'user1' });
        });

        test('updateTask should update and return the task', async () => {
            const mockTask = { id: '1', title: 'Updated Task', status: 'IN_PROGRESS', userId: 'user1' };
            Task.findOne.mockResolvedValue(mockTask);
            mockTask.update = jest.fn().mockResolvedValue(mockTask);

            const result = await taskResolvers.Mutation.updateTask(
                null,
                { id: '1', title: 'Updated Task', status: 'IN_PROGRESS' },
                mockContext
            );
            expect(result).toEqual(mockTask);
            expect(mockTask.update).toHaveBeenCalledWith({ title: 'Updated Task', status: 'IN_PROGRESS' });
        });

        test('deleteTask should delete the task and return true', async () => {
            const mockTask = { id: '1', title: 'Task to Delete', userId: 'user1' };
            Task.findOne.mockResolvedValue(mockTask);
            mockTask.destroy = jest.fn().mockResolvedValue(true);

            const result = await taskResolvers.Mutation.deleteTask(null, { id: '1' }, mockContext);
            expect(result).toBe(true);
            expect(mockTask.destroy).toHaveBeenCalled();
        });
    });
});

