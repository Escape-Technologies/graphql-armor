import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefinitions = /* GraphQL */ `
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

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
