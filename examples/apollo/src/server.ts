import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloArmor } from '@escape.tech/graphql-armor';
import gql from 'graphql-tag';

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);

const typeDefs = gql`
  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }

  type Query {
    books: [Book]
    authors: [Author]
    throw: String
  }
`;

const authors = [
  {
    name: 'Kate Chopin',
    books: ['The Awakening'],
  },
  {
    name: 'Paul Auster',
    books: ['City of Glass'],
  },
];
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

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    throw: () => {
      throw new Error('oops');
    },
  },
};

const armor = new ApolloArmor({
  costLimit: {
    enabled: true,
    maxCost: 100,
    objectCost: 1,
    scalarCost: 1,
    depthCostFactor: 2,
    ignoreIntrospection: true,
  },
  maxAliases: {
    enabled: true,
    n: 1,
  },
  maxDirectives: {
    n: 10,
  },
  maxDepth: {
    n: 4,
  },
  maxTokens: {
    n: 250,
  },
});

interface AppContext {
  token?: string;
}

const protection = armor.protect();
const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  ...protection,
  plugins: [...protection.plugins, ApolloServerPluginDrainHttpServer({ httpServer })],
});

export { app, httpServer, server };
