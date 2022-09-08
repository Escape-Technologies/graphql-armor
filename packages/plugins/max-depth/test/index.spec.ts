import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';

import { maxDepthPlugin } from '../src/index';

const typeDefinitions = `
  type Author {
    name: String
    books: [Book]
  }

  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`;
const books = [
  {
    title: 'The Awakening',
    author: { name: 'Kate Chopin' },
  },
  {
    title: 'City of Glass',
    author: { name: 'Paul Auster' },
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
  Author: {
    books: (author) => books.filter((book) => book.author === author.name),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('global', () => {
  it('should be defined', () => {
    expect(maxDepthPlugin).toBeDefined();

    const t0 = maxDepthPlugin();
    const t1 = maxDepthPlugin({});
    const t2 = maxDepthPlugin({ n: 10 });
  });

  const query = `query {
    books {
      author {
        name
      }
      title
    }
  }`;

  it('should works by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      books: books,
    });
  });

  it('should reject query', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 2 - 1 })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Syntax Error: Query depth limit of 1 exceeded, found 3.',
    ]);
  });

  it('should reject fragment', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 5 - 1 })], schema);
    const result = await testkit.execute(`
    query {
      ...BooksFragment
    }

    fragment BooksFragment on Query {
      books {
        title
        author {
          name
        }
      }
    }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Syntax Error: Query depth limit of 4 exceeded, found 5.',
    ]);
  });

  it('should allow introspection', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 2, ignoreIntrospection: true })], schema);
    const result = await testkit.execute(getIntrospectionQuery());

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data?.__schema).toBeDefined();
  });
});
