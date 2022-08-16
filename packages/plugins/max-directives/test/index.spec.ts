import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { maxDirectivesPlugin } from '../src/index';

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
    expect(maxDirectivesPlugin).toBeDefined();

    const t0 = maxDirectivesPlugin();
    const t1 = maxDirectivesPlugin({});
    const t2 = maxDirectivesPlugin({ n: 10 });
  });

  const query = `query {
    __typename @a @a @a @a
  }`;

  it('should works by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(Array(4).fill('Unknown directive "@a".'));
  });

  it('should reject query', async () => {
    const testkit = createTestkit([maxDirectivesPlugin({ n: 3 })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Too many directives.']);
  });

  it('should works on fragment', async () => {
    const testkit = createTestkit([maxDirectivesPlugin({ n: 3 })], schema);
    const result = await testkit.execute(`query {
        ...DirectivesFragment
      }

      fragment DirectivesFragment on Query {
        __typename @a @a @a @a
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Too many directives.']);
  });
});
