import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';

import { server } from '../src/server';

describe('startup', () => {
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  (async () => {
    await server.start();
  })();

  it('should have no stacktraces', async () => {
    const query = await server.executeOperation({
      query: `query {
        throw
      }`,
    });

    expect(query.errors).toHaveLength(1);
    // @ts-ignore
    expect(query.errors?.map((e) => e.extensions?.exception?.stacktrace)).toEqual([undefined]);
  });

  it('should block too large query', async () => {
    try {
      const query = await server.executeOperation({
        query: `query {
          books {
            title
            author
          } ${' '.repeat(2000)}
        }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain('Query is too large.');
    }
  });

  it('should have cost limit', async () => {
    try {
      const query = await server.executeOperation({
        query: `query {
          ...BooksFragment
          ...BooksFragment
          ...BooksFragment
        }
        
        fragment BooksFragment on Query {
          books {
            title
            author
          }
        }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain('Query is too expensive.');
    }
  });

  it('should block field suggestion', async () => {
    const query = await server.executeOperation({
      query: `query {
        books {
          titlee
          author
        }
      }`,
    });

    expect(query.errors).toBeDefined();
    expect(query.errors?.map((e) => e.message)).toContain(
      'Cannot query field "titlee" on type "Book". [Suggestion message hidden by GraphQLArmor]?',
    );
  });

  it('should limit aliases', async () => {
    try {
      const query = await server.executeOperation({
        query: `query {
          firstBooks: books {
            title
            author
          }
          secondBooks: books {
            title
            author
          }
        }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain('Too many aliases.');
    }
  });

  it('should limit directives', async () => {
    try {
      const query = await server.executeOperation({
        query: `query { __typename ${'@a'.repeat(10 + 1)} }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain('Too many directives.');
    }
  });

  it('should limit depth', async () => {
    try {
      const query = await server.executeOperation({
        query: `query {
          books {
            author {
              books {
                author {
                  name
                }
              }
            }
          }
        }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain('Query is too deep.');
    }
  });

  it('should allow introspection', async () => {
    try {
      const query = await server.executeOperation({
        query: getIntrospectionQuery(),
      });
      expect(query.errors).toBeUndefined();
      expect(query.data).toBeDefined();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});
