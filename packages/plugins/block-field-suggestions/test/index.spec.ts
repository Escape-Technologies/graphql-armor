import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { blockFieldSuggestionsPlugin } from '../src/index';

const typeDefinitions = `
  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE_FICTION
    FANTASY
  }

  type Book {
    title: String
    author: String
    genre: Genre
  }

  type Query {
    books(genre: Genre): [Book]
  }
`;
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    genre: 'FICTION',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    genre: 'NON_FICTION',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'SCIENCE_FICTION',
  },
];

const resolvers = {
  Query: {
    books: (_, args) => {
      if (args.genre) {
        return books.filter((book) => book.genre === args.genre);
      }
      return books;
    },
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
        genre
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

  it('should works on a valid query with a valid enum value', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin()], schema);
    const result = await testkit.execute(
      `
    query GetBooksByGenre($genre: Genre) {
      books(genre: $genre) {
        title
        genre
        author
      }
    }`,
      {
        genre: 'FICTION',
      },
    );

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      books: [
        {
          title: 'The Awakening',
          genre: 'FICTION',
          author: 'Kate Chopin',
        },
      ],
    });
  });

  it('should enable suggestions for a invalid enum value', async () => {
    const testkit = createTestkit([], schema);
    const result = await testkit.execute(
      `
    query GetBooksByGenre($genre: Genre) {
      books(genre: $genre) {
        title
        genre
        author
      }
    }`,
      {
        genre: 'FFICTION',
      },
    );

    assertSingleExecutionValue(result);
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Variable "$genre" got invalid value "FFICTION"; Value "FFICTION" does not exist in "Genre" enum. Did you mean the enum value "FICTION" or "NON_FICTION"?',
    ]);
  });

  it('should disable suggestions for a invalid genre', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin()], schema);
    const result = await testkit.execute(
      `
    query GetBooksByGenre($genre: Genre) {
      books(genre: $genre) {
        title
        author
      }
    }`,
      {
        genre: 'FFICTION',
      },
    );

    assertSingleExecutionValue(result);
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Variable "$genre" got invalid value "FFICTION"; Value "FFICTION" does not exist in "Genre" enum. [Suggestion hidden]',
    ]);
  });

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
      'Cannot query field "titlee" on type "Book". [Suggestion hidden]',
    ]);
  });

  it('should use configured mask', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin({ mask: '<[REDACTED]>' })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      'Cannot query field "titlee" on type "Book". <[REDACTED]>',
    ]);
  });

  it('should use remove suggestion completely with emptry string for mask', async () => {
    const testkit = createTestkit([blockFieldSuggestionsPlugin({ mask: '' })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual(['Cannot query field "titlee" on type "Book".']);
  });
});
