import { describe, expect, it } from '@jest/globals';
import assert from 'assert';
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
    const { body } = await server.executeOperation({
      query: `query {
        throw
      }`,
    });

    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toHaveLength(1);
    // @ts-ignore
    expect(query.errors?.map((e) => e.extensions?.exception?.stacktrace)).toEqual([undefined]);
  });

  it('should block too many tokens', async () => {
    const maxTokens = 250;
    try {
      await server.executeOperation({
        query: `query { ${Array(maxTokens + 1).join('a ')} }`,
      });
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toContain(`Syntax Error: Token limit of ${maxTokens} exceeded, found ${maxTokens + 1}.`);
    }
  });

  it('should have cost limit', async () => {
    const { body } = await server.executeOperation({
      query: `query {
        ...BooksFragment
        ...BooksFragment
        ...BooksFragment
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
    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toBeDefined();
    expect(query.errors?.map((e) => e.message)).toContain(
      'Syntax Error: Query Cost limit of 100 exceeded, found 5023.',
    );
  });

  it('should block field suggestion', async () => {
    const { body } = await server.executeOperation({
      query: `query {
        books {
          titlee
          author
        }
      }`,
    });
    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toBeDefined();
    expect(query.errors).toHaveLength(2);
    expect(query.errors?.map((e) => e.message)).toContain(
      'Cannot query field "titlee" on type "Book". [Suggestion hidden]?',
    );
  });

  it('should limit aliases', async () => {
    const { body } = await server.executeOperation({
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
    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toBeDefined();
    expect(query.errors?.map((e) => e.message)).toContain('Syntax Error: Aliases limit of 1 exceeded, found 2.');
  });

  it('should limit directives', async () => {
    const directivesCount = 11;
    const { body } = await server.executeOperation({
      query: `query { __typename ${'@a'.repeat(directivesCount)} }`,
    });
    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toBeDefined();
    expect(query.errors).toHaveLength(directivesCount + 1);
    expect(query.errors?.map((e) => e.message)).toContain(
      `Syntax Error: Directives limit of ${directivesCount - 1} exceeded, found ${directivesCount}.`,
    );
  });

  it('should limit depth', async () => {
    const { body } = await server.executeOperation({
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
    assert(body.kind === 'single');

    const query = body.singleResult;
    expect(query.errors).toBeDefined();
    expect(query.errors?.map((e) => e.message)).toContain('Syntax Error: Query depth limit of 4 exceeded, found 5.');
  });

  it('should allow introspection', async () => {
    try {
      const { body } = await server.executeOperation({
        query: getIntrospectionQuery(),
      });
      assert(body.kind === 'single');

      const query = body.singleResult;
      expect(query.errors).toBeUndefined();
      expect(query.data?.__schema).toBeDefined();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});
