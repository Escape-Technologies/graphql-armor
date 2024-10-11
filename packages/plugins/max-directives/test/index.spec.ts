import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { jest } from '@jest/globals';

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

describe('maxDirectivesPlugin', () => {
  it('should be defined', () => {
    expect(maxDirectivesPlugin).toBeDefined();

    const t0 = maxDirectivesPlugin();
    const t1 = maxDirectivesPlugin({});
    const t2 = maxDirectivesPlugin({ n: 10 });
  });

  const query = `query {
    __typename @a @a @a @a
  }`;

  it('should work by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(Array(4).fill('Unknown directive "@a".'));
  });

  it('should reject query exceeding max directives', async () => {
    const maxDirectives = 3;
    const testkit = createTestkit([maxDirectivesPlugin({ n: maxDirectives })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Directives limit of ${maxDirectives} exceeded, found ${maxDirectives + 1}.`,
    ]);
  });

  it('should work on fragment', async () => {
    const maxDirectives = 3;
    const testkit = createTestkit([maxDirectivesPlugin({ n: maxDirectives })], schema);
    const result = await testkit.execute(`query {
        ...DirectivesFragment
      }

      fragment DirectivesFragment on Query {
        __typename @a @a @a @a
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Directives limit of ${maxDirectives} exceeded, found ${maxDirectives + 1}.`,
    ]);
  });

  it('should not crash on recursive fragment', async () => {
    const testkit = createTestkit([maxDirectivesPlugin({ n: 3 })], schema);
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
    expect(result.errors?.map((error) => error.message)).toContain('Cannot spread fragment "A" within itself via "B".');
  });

  it('rejects with a generic error message when exposeLimits is false', async () => {
    const maxDirectives = 3;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [maxDirectivesPlugin({ n: maxDirectives, exposeLimits: false, errorMessage: customMessage })],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([`Syntax Error: ${customMessage}`]);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const maxDirectives = 3;
    const testkit = createTestkit([maxDirectivesPlugin({ n: maxDirectives, exposeLimits: true })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Directives limit of ${maxDirectives} exceeded, found ${maxDirectives + 1}.`,
    ]);
  });
});
