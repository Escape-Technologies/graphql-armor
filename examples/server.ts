import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
const express = require('express');
const http = require('http');
import { gql } from 'apollo-server';
import { GQLArmor } from '../src';

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

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook: (title: String, author: String) => {
      return { title: 'title_test', author: 'author_test' };
    },
  },
};

const app = express();
const httpServer = http.createServer(app);

const armor = new GQLArmor(
  {
    CharacterLimit: {
      options: {
        maxLength: 100,
      },
    },
    Introspection: {
      enabled: true,
    },
  },
  (status: string, plugin: any) => {
    console.log(status, plugin._namespace);
  }
);

const server = armor.apolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded',
  // eslint-disable-next-line new-cap
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
