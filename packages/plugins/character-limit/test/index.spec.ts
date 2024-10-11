import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { jest } from '@jest/globals';

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
      `Syntax Error: Character limit of ${length} exceeded, found ${length + 1}.`
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
      schema
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
      schema
    );
    const longQuery = 'query { ' + 'a'.repeat(length + 2) + ' }';
    const result = await testkit.execute(longQuery);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toEqual(
      `Syntax Error: Character limit of ${length} exceeded, found ${length + 2}.`
    );
  });

  it('executes onAccept handlers when under the character limit', async () => {
    const maxLength = 50;
    const operation = `query {
      books {
        title
      }
    }`;
    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    const testkit = createTestkit(
      [
        characterLimitPlugin({
          maxLength: maxLength,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
        }),
      ],
      schema
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { queryLength: operation.length });
    expect(onRejectMock).not.toHaveBeenCalled();
  });

  it('executes onReject handlers when over the character limit', async () => {
    const maxLength = 10;
    const operation = 'query { ' + 'a'.repeat(maxLength + 1) + ' }';
    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    const testkit = createTestkit(
      [
        characterLimitPlugin({
          maxLength: maxLength,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
        }),
      ],
      schema
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toEqual(
      `Syntax Error: Character limit of ${maxLength} exceeded, found ${maxLength + 1}.`
    );
    expect(onAcceptMock).not.toHaveBeenCalled();
    expect(onRejectMock).toHaveBeenCalled();
  });

  it('executes both onAccept and onReject handlers appropriately', async () => {
    const maxLength = 20;
    const operationUnder = `query {
      books {
        title
      }
    }`; // length < 20
    const operationOver = `query {
      books {
        title
        author
      }
    }`; // length > 20
    const onAcceptMock = jest.fn();
    const onRejectMock = jest.fn();

    // Test under the limit
    const testkitUnder = createTestkit(
      [
        characterLimitPlugin({
          maxLength: maxLength,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
        }),
      ],
      schema
    );
    const resultUnder = await testkitUnder.execute(operationUnder);
    assertSingleExecutionValue(resultUnder);
    expect(resultUnder.errors).toBeUndefined();
    expect(onAcceptMock).toHaveBeenCalledWith(null, { queryLength: operationUnder.length });
    expect(onRejectMock).not.toHaveBeenCalled();

    // Reset mocks
    onAcceptMock.mockReset();
    onRejectMock.mockReset();

    // Test over the limit
    const testkitOver = createTestkit(
      [
        characterLimitPlugin({
          maxLength: maxLength,
          onAccept: [onAcceptMock],
          onReject: [onRejectMock],
        }),
      ],
      schema
    );
    const resultOver = await testkitOver.execute(operationOver);
    assertSingleExecutionValue(resultOver);
    expect(resultOver.errors).toBeDefined();
    expect(resultOver.errors?.[0].message).toEqual(
      `Syntax Error: Character limit of ${maxLength} exceeded, found ${operationOver.length}.`
    );
    expect(onAcceptMock).not.toHaveBeenCalled();
    expect(onRejectMock).toHaveBeenCalled();
  });
});