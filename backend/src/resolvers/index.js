const userResolvers = require('./user');
const taskResolvers = require('./task');

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...taskResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...taskResolvers.Mutation,
  },
  User: userResolvers.User,
  Task: taskResolvers.Task,
};