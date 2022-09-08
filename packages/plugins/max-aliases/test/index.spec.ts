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
    getBook: (title: string) => books.find((book) => book.title === title),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('global', () => {
  it('should be defined', () => {
    expect(maxAliasesPlugin).toBeDefined();

    const t0 = maxAliasesPlugin();
    const t1 = maxAliasesPlugin({});
    const t2 = maxAliasesPlugin({ n: 10 });
  });

  const query = `query {
    firstBooks: getBook(title: "null") {
      author
      title
    }
    secondBooks: getBook(title: "null") {
      author
      title
    }
  }`;

  it('should works by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      firstBooks: null,
      secondBooks: null,
    });
  });

  it('should reject query', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });

  it('should respect fragment aliases', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases })], schema);
    const result = await testkit.execute(/* GraphQL */ `
      query A {
        getBook(title: "null") {
          firstTitle: title
          ...BookFragment
        }
      }
      fragment BookFragment on Book {
        secondTitle: title
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });
});
