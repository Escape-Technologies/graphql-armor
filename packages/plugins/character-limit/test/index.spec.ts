import { Plugin } from '@envelop/core';
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

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

const mockedParsePlugin = (): Plugin => {
  return {
    onParse({ params, extendContext }) {
      extendContext({
        query: params.source,
      });
    },
  };
};

describe('global', () => {
  it('should be defined', () => {
    expect(characterLimitPlugin).toBeDefined();
  });

  const query = `query {
    books {
      title
      author
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
    const testkit = createTestkit([mockedParsePlugin(), characterLimitPlugin({ maxLength: 54 - 1 })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Query is too large.']);
  });
});
