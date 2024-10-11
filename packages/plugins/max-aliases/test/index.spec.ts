import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { jest } from '@jest/globals';

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
    const maxAliases = 2;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, exposeLimits: false, errorMessage: customMessage })],
      schema
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: ${customMessage}`,
    ]);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const maxAliases = 2;
    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, exposeLimits: true })],
      schema
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
  });

  it('executes onAccept handlers when under the alias limit', async () => {
    const maxAliases = 3;
    const operation = `query {
      allowed: getBook(title: "null") {
        author
        title
      }
    }`;
    const onAcceptMock = jest.fn();

    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, onAccept: [onAcceptMock] })],
      schema
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { n: 1 });
  });

  it('executes onReject handlers when over the alias limit', async () => {
    const maxAliases = 1;
    const operation = `query {
      firstAlias: getBook(title: "null") {
        author
        title
      }
      secondAlias: getBook(title: "null") {
        author
        title
      }
    }`;
    const onRejectMock = jest.fn();

    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, onReject: [onRejectMock] })],
      schema
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
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

    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, allowList, onReject: [onRejectMock] })],
      schema
    );
    const result = await testkit.execute(operation);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
  });

  it('allows multiple allowed aliases without rejecting', async () => {
    const maxAliases = 2;
    const allowList = ['allowed1', 'allowed2'];
    const operation = `query {
      allowed1: getBook(title: "null") {
        allowed2: author
      }
      disallowed: getBook(title: "null") {
        author
      }
    }`;
    const onRejectMock = jest.fn();

    const testkit = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, allowList, onReject: [onRejectMock] })],
      schema
    );
    const result = await testkit.execute(operation);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
  });

  it('executes both onAccept and onReject handlers appropriately', async () => {
    const maxAliases = 2;
    const operationUnder = `query {
      firstAlias: getBook(title: "null") {
        author
      }
      secondAlias: getBook(title: "null") {
        title
      }
    }`;
    const operationOver = `query {
      firstAlias: getBook(title: "null") {
        author
      }
      secondAlias: getBook(title: "null") {
        title
      }
      thirdAlias: getBook(title: "null") {
        author
      }
    }`;
    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    // Test under the limit
    const testkitUnder = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, onAccept: [onAcceptMock], onReject: [onRejectMock] })],
      schema
    );
    const resultUnder = await testkitUnder.execute(operationUnder);
    assertSingleExecutionValue(resultUnder);
    expect(resultUnder.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { n: 2 });
    expect(onRejectMock).not.toHaveBeenCalled();

    // Reset mocks
    onAcceptMock.mockReset();
    onRejectMock.mockReset();

    // Test over the limit
    const testkitOver = createTestkit(
      [maxAliasesPlugin({ n: maxAliases, onAccept: [onAcceptMock], onReject: [onRejectMock] })],
      schema
    );
    const resultOver = await testkitOver.execute(operationOver);
    assertSingleExecutionValue(resultOver);
    expect(resultOver.errors).toBeDefined();
    expect(resultOver.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Aliases limit of ${maxAliases} exceeded, found ${maxAliases + 1}.`,
    ]);
    expect(onAcceptMock).not.toHaveBeenCalled();
    expect(onRejectMock).toHaveBeenCalled();
  });
});