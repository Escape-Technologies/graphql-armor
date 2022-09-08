import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';
import request from 'supertest';

import { initServer } from '../src/server';

describe('startup', () => {
  const server = initServer();
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  it('should have no stacktraces', async () => {
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
    // @ts-ignore
    expect(response.body.errors?.map((e) => e.extensions?.exception?.stacktrace)).toEqual([undefined]);
  });

  it('should block too large query', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `query {
        books {
          title
          author
        } ${' '.repeat(2000)}
      }`,
      });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Character limit of 2000 exceeded, found 2075.');
  });

  it('should have cost limit', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
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

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data?.books).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(body.errors?.map((e) => e.message)).toContain('Syntax Error: Query Cost limit of 100 exceeded, found 139.');
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

    expect(response.statusCode).toBe(400);
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
    const body = JSON.parse(response.text);
    expect(body.data).toBeDefined();
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
    expect(body.data).toBeDefined();
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
