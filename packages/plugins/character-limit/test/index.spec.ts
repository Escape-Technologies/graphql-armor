import { useExtendContext } from '@envelop/core';
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { characterLimitPlugin } from '../src/index';

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
    expect(characterLimitPlugin).toBeDefined();
  });

  it('should works by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(`
    query {
      books {
        title
        author
      }
    }`);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      books: books,
    });
  });

  // it('should reject query', async () => {
  //   const testkit = createTestkit([characterLimitPlugin({ maxLength: 43 })], schema);
  //   const result = await testkit.execute(`
  //   query {
  //     books {
  //       title
  //       author
  //     }
  //   }`);

  //   assertSingleExecutionValue(result);
  //   expect(result.errors).toBeDefined();
  //   expect(result.errors?.map((error) => error.message)).toEqual(['Source is too large.']);
  // });
});
