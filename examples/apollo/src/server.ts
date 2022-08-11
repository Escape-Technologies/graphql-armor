import { ApolloArmor } from '@escape.tech/graphql-armor';
import { gql } from 'apollo-server';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

const typeDefs = gql`
  type Book {
    id: String
    title: String
    author: String
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
    id: '1',
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: '2',
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const armor = new ApolloArmor({
  characterLimit: {
    enabled: true,
    maxLength: 1000,
  },
});

const enhancements = armor.protect();

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded',
  plugins: [...enhancements.plugins],
  validationRules: [...enhancements.validationRules],
});
