import { ApolloArmor } from '@escape.tech/graphql-armor';
import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';

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
  characterLimit: {
    enabled: true,
    maxLength: 1000,
  },
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
    enabled: true,
    n: 10,
  },
  maxDepth: {
    enabled: true,
    n: 4,
  },
});

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...armor.protect(),
});
