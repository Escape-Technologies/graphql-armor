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

describe('characterLimitPlugin', () => {
  it('should be defined', () => {
    expect(characterLimitPlugin).toBeDefined();

    const t0 = characterLimitPlugin();
    const t1 = characterLimitPlugin({});
    const t2 = characterLimitPlugin({ maxLength: 100 });
  });

  const query = `query {
    books {
      title
      author
    }
  }`;

  it('should work by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      books: books,
    });
  });

  it('should reject query exceeding max length', async () => {
    const length = query.length - 1;
    const testkit = createTestkit([characterLimitPlugin({ maxLength: length })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toEqual(
      `Syntax Error: Character limit of ${length} exceeded, found ${length + 1}.`,
    );
  });

  it('should not limit query variables', async () => {
    const length = query.length;
    const testkit = createTestkit([characterLimitPlugin({ maxLength: length })], schema);
    const result = await testkit.execute(query, {
      variables: {
        foo: 'bar'.repeat(100),
      },
    });

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      books: books,
    });
  });

  it('rejects with a generic error message when exposeLimits is false', async () => {
    const length = 10;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [
        characterLimitPlugin({
          maxLength: length,
          exposeLimits: false,
          errorMessage: customMessage,
        }),
      ],
      schema,
    );
    const longQuery = 'query { ' + 'a'.repeat(length + 1) + ' }';
    const result = await testkit.execute(longQuery);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toEqual(`Syntax Error: ${customMessage}`);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const length = 10;
    const testkit = createTestkit(
      [
        characterLimitPlugin({
          maxLength: length,
          exposeLimits: true,
        }),
      ],
      schema,
    );
    const longQuery = 'query { ' + 'a'.repeat(length + 2) + ' }';
    const result = await testkit.execute(longQuery);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toEqual(
      `Syntax Error: Character limit of ${length} exceeded, found ${length + 10 + 2}.`,
    );
  });
});
