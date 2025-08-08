import type { Plugin } from '@envelop/types';
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { jest } from '@jest/globals';

import { maxAliasesPlugin } from '../src/index';

// test checking if the plugin inherits the context correctly
const _test_0: Plugin = maxAliasesPlugin();
const _test_1: Plugin<{ my: 'ctx' }> = maxAliasesPlugin();

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
    getBook: (_: any, { title }: { title: string }) => books.find((book) => book.title === title),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('maxAliasesPlugin', () => {
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

  it('should work by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      firstBooks: null,
      secondBooks: null,
    });
  });

  it('rejects query exceeding max aliases', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });

  it('does not count __typename aliases against limit', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases })], schema);
    const result = await testkit.execute(/* GraphQL */ `
      query A {
        getBook(title: "null") {
          typenameA: __typename
          typenameB: __typename
        }
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      getBook: null,
    });
  });

  it('counts __typename aliases against limit when not included in allowList', async () => {
    const maxAliases = 1;
    const allowList = [];
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases, allowList })], schema);
    const result = await testkit.execute(/* GraphQL */ `
      query A {
        getBook(title: "null") {
          typenameA: __typename
          typenameB: __typename
        }
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });

  it('respects fragment aliases', async () => {
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

  it('does not crash on recursive fragment', async () => {
    const testkit = createTestkit([maxAliasesPlugin({ n: 3 })], schema);
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

  it('does not reject allowed aliases', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases, allowList: ['allowed'] })], schema);
    const result = await testkit.execute(`query {
      allowed: getBook(title: "null") {
        allowed: author
      }
    }`);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      allowed: null,
    });
  });

  it('rejects with a generic error message when exposeLimits is false', async () => {
    const maxAliases = 1;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, exposeLimits: false, errorMessage: customMessage })],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([`Syntax Error: ${customMessage}`]);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const maxAliases = 1;
    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases, exposeLimits: true })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });

  it('does not count allowed aliases against the limit', async () => {
    const maxAliases = 1;
    const allowList = ['allowed'];
    const operation = `query {
      allowed: getBook(title: "null") {
        anotherAllowed: author
      }
      disallowed: getBook(title: "null") {
        author
      }
    }`;
    const onRejectMock = jest.fn();

    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases, allowList, onReject: [onRejectMock] })], schema);
    const result = await testkit.execute(operation);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
  });

  it('allows multiple allowed aliases without rejecting', async () => {
    const maxAliases = 1;
    const allowList = ['allowed1'];
    const operation = `query {
      allowed1: getBook(title: "null") {
        allowed2: author
      }
      disallowed: getBook(title: "null") {
        author
      }
    }`;
    const onRejectMock = jest.fn();

    const testkit = createTestkit([maxAliasesPlugin({ n: maxAliases, allowList, onReject: [onRejectMock] })], schema);
    const result = await testkit.execute(operation);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
  });
});
