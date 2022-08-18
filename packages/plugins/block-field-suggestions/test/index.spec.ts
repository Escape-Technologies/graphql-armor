import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { blockFieldSuggestionsPlugin } from '../src/index';

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
    expect(blockFieldSuggestionsPlugin).toBeDefined();
  });

  it('should works on a valid query', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin()], schema);
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

  const query = `query {
    books {
      titlee
      author
    }
  }`;

  /** This is a deprecation guard in case it is removed from GraphQL-JS */
  it('should suggest field by default', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Cannot query field "titlee" on type "Book". Did you mean "title"?',
    ]);
  });

  it('should disable field suggestions', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin()], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Cannot query field "titlee" on type "Book". [Suggestion message hidden by GraphQLArmor]?',
    ]);
  });

  it('should use configured mask', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin({ mask: '<[REDACTED]>' })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Cannot query field "titlee" on type "Book". <[REDACTED]>?',
    ]);
  });
});
