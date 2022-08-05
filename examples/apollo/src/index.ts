import { ApolloArmor } from '@escape.tech/graphql-armor';
import { gql } from 'apollo-server';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

const express = require('express');
const http = require('http');

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Nested {
    child: Nested
    text: String
  }

  type Query {
    books: [Book]
    nested: Nested
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const nestedResolver = (i = 0) => {
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 50 * i));
    return {
      child: nestedResolver(i + 1),
      text: 'text' + i,
    };
  };
};

const resolvers = {
  Query: {
    books: () => books,
    nested: nestedResolver(0),
  },
  Mutation: {
    addBook: (title: string, author: string) => {
      return { title: 'title_test', author: 'author_test' };
    },
  },
};

const app = express();

const httpServer = http.createServer(app);

const armor = new ApolloArmor({
  characterLimit: {
    enabled: true,
    maxLength: 10000,
  },
});

const enhancements = armor.protect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ...enhancements.plugins],
  validationRules: [...enhancements.validationRules],
});

(async () => {
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  await new Promise<void>((resolve) => {
    const x = httpServer.listen({ port: 4000 }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
