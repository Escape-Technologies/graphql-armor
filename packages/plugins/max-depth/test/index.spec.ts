import type { Plugin } from '@envelop/types';
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';

import { maxDepthPlugin } from '../src/index';

// test checking if the plugin inherits the context correctly
const _test_0: Plugin = maxDepthPlugin();
const _test_1: Plugin<{ my: 'ctx' }> = maxDepthPlugin();

const typeDefinitions = `
  type Author {
    name: String
    books: [Book]
  }

  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: { name: 'Kate Chopin' },
  },
  {
    title: 'City of Glass',
    author: { name: 'Paul Auster' },
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
  Author: {
    books: (author) => books.filter((book) => book.author.name === author.name),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('maxDepthPlugin', () => {
  it('should be defined', () => {
    expect(maxDepthPlugin).toBeDefined();

    const t0 = maxDepthPlugin();
    const t1 = maxDepthPlugin({});
    const t2 = maxDepthPlugin({ n: 10 });
  });

  const query = `query {
    books {
      author {
        name
      }
      title
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

  it('rejects query exceeding max depth', async () => {
    const maxDepth = 1;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 2}.`,
    ]);
  });

  it('rejects fragment exceeding max depth', async () => {
    const maxDepth = 4;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth })], schema);
    const result = await testkit.execute(`
      query {
        ...BooksFragment
      }

      fragment BooksFragment on Query {
        books {
          title
          author {
            name
          }
        }
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 1}.`,
    ]);
  });

  it('rejects flattened fragment exceeding max depth', async () => {
    const maxDepth = 2;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth, flattenFragments: true })], schema);
    const result = await testkit.execute(`
      query {
        ...BooksFragment
      }

      fragment BooksFragment on Query {
        books {
          title
          author {
            name
          }
        }
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 1}.`,
    ]);
  });

  it('rejects flattened inline fragment exceeding max depth', async () => {
    const maxDepth = 2;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth, flattenFragments: true })], schema);
    const result = await testkit.execute(`
      query {
        ...on Query {
          books {
            title
            author {
              name
            }
          }
        }
      }
    `);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 1}.`,
    ]);
  });

  it('allows introspection queries when ignoreIntrospection is true', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 2, ignoreIntrospection: true })], schema);
    const result = await testkit.execute(getIntrospectionQuery());

    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
    expect(result.data?.__schema).toBeDefined();
  });

  it('rejects recursive fragment exceeding max depth', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 3 })], schema);
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
    expect(result.errors?.map((error) => error.message)).toContain(
      'Syntax Error: Query depth limit of 3 exceeded, found 5.',
    );
  });

  it('rejects flattened recursive fragment exceeding max depth', async () => {
    const testkit = createTestkit([maxDepthPlugin({ n: 3, flattenFragments: true })], schema);
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
    const maxDepth = 2;
    const customMessage = 'Custom error message.';
    const testkit = createTestkit(
      [maxDepthPlugin({ n: maxDepth, exposeLimits: false, errorMessage: customMessage })],
      schema,
    );
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([`Syntax Error: ${customMessage}`]);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const maxDepth = 2;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth, exposeLimits: true })], schema);
    const result = await testkit.execute(query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 1}.`,
    ]);
  });

  it('rejects for fragment named `__schema` exceeding max depth', async () => {
    const bypass_query = `
      query {
        books {
          author {
            books {
              author {
                ...__schema
              }
            }
          }
        }
      }
      fragment __schema on Author {
        books {
          title
        }
      }
    `;
    const maxDepth = 6;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth, exposeLimits: true })], schema);
    const result = await testkit.execute(bypass_query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 2}.`,
    ]);
  });

  it('rejects for exceeding max depth by reusing a cached Fragment', async () => {
    const bypass_query = `
      query {
        books {
          author {
            ...Test
          }
        }
        books {
          author {
            books {
              author {
                ...Test
              }
            }
          }
        }
      }
      fragment Test on Author {
        books {
          title
        }
      }
    `;
    const maxDepth = 6;
    const testkit = createTestkit([maxDepthPlugin({ n: maxDepth, exposeLimits: true })], schema);
    const result = await testkit.execute(bypass_query);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 2}.`,
    ]);
  });
});
