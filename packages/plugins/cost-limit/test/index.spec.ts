import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { jest } from '@jest/globals';
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
    getBook: (_: any, { title }: { title: string }) => books.find((book) => book.title === title),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('costLimitPlugin', () => {
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

  it('should work for default query', async () => {
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
          maxCost: 10,
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
    expect(result.errors?.map((error) => error.message)).toContain('Cannot spread fragment "A" within itself via "B".');
  });

  it('rejects with a generic error message when exposeLimits is false', async () => {
    const maxCost = 10;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          exposeLimits: false,
          errorMessage: customMessage,
          objectCost: 2,
          scalarCost: 1,
          depthCostFactor: 1.5,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: ${customMessage}`,
    ]);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const maxCost = 10;
    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          exposeLimits: true,
          objectCost: 2,
          scalarCost: 1,
          depthCostFactor: 1.5,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query Cost limit of ${maxCost} exceeded, found 12.`,
    ]);
  });

  it('executes onAccept handlers when under the cost limit', async () => {
    const maxCost = 15;
    const operation = `query {
      books {
        title
        author
      }
    }`;
    const onAcceptMock = jest.fn();

    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          onAccept: [onAcceptMock],
          objectCost: 2,
          scalarCost: 1,
          depthCostFactor: 1.5,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { n: 12 });
  });

  it('executes onReject handlers when over the cost limit', async () => {
    const maxCost = 10;
    const operation = `query {
      books {
        title
        author
      }
    }`;
    const onRejectMock = jest.fn();

    const testkit = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          onReject: [onRejectMock],
          objectCost: 4,
          scalarCost: 2,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query Cost limit of ${maxCost} exceeded, found 12.`,
    ]);
    expect(onRejectMock).toHaveBeenCalled();
  });

  it('executes both onAccept and onReject handlers appropriately', async () => {
    const maxCost = 10;
    const operationUnder = `query {
      books {
        title
      }
    }`;
    const operationOver = `query {
      books {
        title
        author
      }
    }`;
    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    // Test under the limit
    const testkitUnder = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
          objectCost: 2,
          scalarCost: 1,
          depthCostFactor: 1.5,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const resultUnder = await testkitUnder.execute(operationUnder);
    assertSingleExecutionValue(resultUnder);
    expect(resultUnder.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { n: 6 });
    expect(onRejectMock).not.toHaveBeenCalled();

    // Reset mocks
    onAcceptMock.mockReset();
    onRejectMock.mockReset();

    // Test over the limit
    const testkitOver = createTestkit(
      [
        costLimitPlugin({
          maxCost: maxCost,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
          objectCost: 4,
          scalarCost: 2,
          depthCostFactor: 2,
          ignoreIntrospection: true,
        }),
      ],
      schema,
    );
    const resultOver = await testkitOver.execute(operationOver);
    assertSingleExecutionValue(resultOver);
    expect(resultOver.errors).toBeDefined();
    expect(resultOver.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query Cost limit of ${maxCost} exceeded, found 12.`,
    ]);
    expect(onAcceptMock).not.toHaveBeenCalled();
    expect(onRejectMock).toHaveBeenCalled();
  });
});