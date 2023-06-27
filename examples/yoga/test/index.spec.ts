import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';
import { createServer } from 'node:http';
import request from 'supertest';

import { yoga } from '../src/yoga';

describe('startup', () => {
  const server = createServer(yoga);
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  it('should have no stacktraces', async () => {
    // Note: when running the test the console.error() used in the `throw` resolver will be printed to the console.
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `query {
        throw
      }`,
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors?.map((e) => e.message)).toContain('Unexpected error.');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.body.errors?.map((e) => e.extensions?.exception?.stacktrace)).toEqual([undefined]);
  });

  it('should block too many tokens', async () => {
    const maxTokens = 250;
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `query { ${Array(maxTokens + 1).join('a ')} }`,
      });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain(
      `Syntax Error: Token limit of ${maxTokens} exceeded, found ${maxTokens + 1}.`,
    );
  });

  it('should have cost limit', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
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

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Query Cost limit of 100 exceeded, found 138.');
  });

  it('should disable field suggestion', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `query {
        books {
          titlee
        }
      }`,
      });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain(
      'Cannot query field "titlee" on type "Book". [Suggestion hidden]?',
    );
  });

  it('should limit aliases', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
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

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text); // ?
    expect(body.data).toBeUndefined();
    expect(body.data?.__typename).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Aliases limit of 1 exceeded, found 2.');
  });

  it('should limit directives', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `query {
        __typename ${'@a'.repeat(10 + 1)}
      }`,
      });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data).toBeUndefined();
    expect(body.data?.__typename).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Directives limit of 10 exceeded, found 11.');
  });

  it('should limit depth', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
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

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Query depth limit of 4 exceeded, found 5.');
  });

  it('should allow introspection', async () => {
    const response = await request(server).post('/graphql').send({
      query: getIntrospectionQuery(),
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.__schema).toBeDefined();
    expect(body.errors).toBeUndefined();
  });
});
