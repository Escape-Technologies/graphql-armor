import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';
import { exitCode } from 'process';

import { maxDepthPlugin } from '../src/index';

const typeDefinitions = `
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
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
      books: books,
    });
  });

  it('should reject query', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 2 - 1 })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Query is too deep.']);
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
        author
      }
    }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Query is too deep.']);
  });

  it('should allow introspection', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 2, ignoreIntrospection: true })], schema);
    const result = await testkit.execute(getIntrospectionQuery());

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
  });
});
