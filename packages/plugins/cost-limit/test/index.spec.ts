import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';

import { costLimitPlugin } from '../src/index';

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
    expect(costLimitPlugin).toBeDefined();

    const t0 = costLimitPlugin();
    const t1 = costLimitPlugin({});
    const t2 = costLimitPlugin({ maxCost: 6000 });
  });

  const query = `query {
    books {
      title
      author
    }
  }`;

  it('should works for default query', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({ books: books });
  });

  it('should limit cost', async () => {
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: 10,
          objectCost: 4,
          scalarCost: 2,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Syntax Error: Query Cost limit of 10 exceeded, found 12.',
    ]);
  });

  it('should allow introspection', async () => {
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: 11 - 1,
          objectCost: 1,
          scalarCost: 1,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(getIntrospectionQuery());

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data?.__schema).toBeDefined();
  });

  it('should support fragment', async () => {
    const maxCost = 57;
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          objectCost: 4,
          scalarCost: 2,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(`
    query {
      ...BookFragment
    }

    fragment BookFragment on Query {
      books {
        title
        author
      }
    }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query Cost limit of ${maxCost} exceeded, found ${maxCost + 1}.`,
    ]);
  });

  it('should not crash on recursive fragment', async () => {
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: 50,
          objectCost: 4,
          scalarCost: 2,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(`query {
        ...A
      }

      fragment A on Query {
        ...B
      }

      fragment B on Query {
        ...A
      }
    `);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toContain(
      'Syntax Error: Query Cost limit of 50 exceeded, found 16050.',
    );
  });
});
