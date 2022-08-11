import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { maxAliasesPlugin } from '../src/index';

const typeDefinitions = `
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    getBook(title: String): Book
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
    getBook: (title: String) => books.find((book) => book.title === title),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('global', () => {
  it('should be defined', () => {
    expect(maxAliasesPlugin).toBeDefined();
  });

  it('should works by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(`
    query {
      firstBook: getBook(title: "null") {
        author
        title
      }
      secondBook: getBook(title: "null") {
        author
        title
      }
    }`);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      firstBook: null,
      secondBook: null,
    });
  });

  it('should reject query', async () => {
    const testkit = createTestkit([maxAliasesPlugin({ n: 1 })], schema);
    const result = await testkit.execute(`
    query {
      firstBook: getBook(title: "null") {
        author
        title
      }
      secondBook: getBook(title: "null") {
        author
        title
      }
    }`);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Too many aliases.']);
  });
});
