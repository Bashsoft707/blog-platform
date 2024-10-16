const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { sequelize } = require('./src/models');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const { authenticate } = require('./src/utils/auth');

const app = express();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await authenticate(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();