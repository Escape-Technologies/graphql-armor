import { beforeAll, describe, expect, it } from '@jest/globals';
import { json } from 'body-parser';
import { expressMiddleware } from '@as-integrations/express5';
import request from 'supertest';

import { app, server } from '../src/server';

/**
 * HTTP-level integration tests: plugin rejections must surface as clean
 * GraphQL errors over the wire. In-process `executeOperation` calls can hide
 * cross-copy graphql issues (e.g. `GraphQLError` instanceof failures) that
 * only show up when the error travels through a real server stack.
 */
describe('apollo http integration', () => {
  beforeAll(async () => {
    await server.start();
    app.use(
      '/graphql',
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
      }),
    );
  });

  const post = (query: unknown) =>
    request(app)
      .post('/graphql')
      .send(typeof query === 'string' ? { query } : query);

  // Alternating books/author chain of `levels` nested selections.
  const nested = (levels: number) => {
    let query = 'query { ';
    let field = 'books';
    for (let i = 0; i < levels; i++) {
      query += `${field} { `;
      field = field === 'books' ? 'author' : 'books';
    }
    query += `${field === 'author' ? 'name' : 'title'} } `;
    query += '} '.repeat(levels);
    return query;
  };

  const messages = (res: { body: { errors?: { message: string }[] } }) => (res.body.errors ?? []).map((e) => e.message);

  it('serves a plain query', async () => {
    const res = await post('{ books { title } }');
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.books).toHaveLength(2);
  });

  it('rejects too many aliases over http', async () => {
    const res = await post('{ a: books { title } b: books { title } }');
    expect(res.body.data).toBeUndefined();
    expect(messages(res)).toContain('Syntax Error: Aliases limit of 1 exceeded, found 2.');
  });

  it('rejects queries exceeding the depth limit over http', async () => {
    const res = await post(nested(5));
    expect(res.body.data).toBeUndefined();
    expect(messages(res).some((m) => m.includes('depth limit of 4 exceeded'))).toBe(true);
  });

  it('rejects queries exceeding the token limit over http', async () => {
    const res = await post(`query { ${Array(251).join('a ')} }`);
    expect(res.body.data).toBeUndefined();
    expect(messages(res)).toContain('Syntax Error: Token limit of 250 exceeded.');
  });

  it('rejects queries exceeding the cost limit over http', async () => {
    const res = await post(`query {
      ...F ...F ...F ...F ...F ...F
    }
    fragment F on Query { books { title author } }`);
    expect(res.body.data).toBeUndefined();
    expect(messages(res).some((m) => m.startsWith('Syntax Error: Query Cost limit of 100 exceeded, found'))).toBe(true);
  });

  it('rejects queries exceeding the directive limit over http', async () => {
    const res = await post(`query { __typename ${'@a'.repeat(11)} }`);
    expect(messages(res)).toContain('Syntax Error: Directives limit of 10 exceeded, found 11.');
  });

  it('hides field suggestions over http', async () => {
    const res = await post('{ books { titlee } }');
    expect(messages(res).some((m) => m.includes('Cannot query field "titlee"'))).toBe(true);
    expect(messages(res).some((m) => m.includes('[Suggestion hidden]'))).toBe(true);
    expect(messages(res).some((m) => m.includes('Did you mean'))).toBe(false);
  });

  it('does not leak stacktraces over http', async () => {
    const res = await post('{ throw }');
    expect(res.status).toBe(200);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].message).toBe('oops');
    expect(JSON.stringify(res.body)).not.toContain('stacktrace');
  });

  it('refuses batched requests', async () => {
    const res = await post([{ query: '{ books { title } }' }]);
    expect(res.status).toBe(400);
  });
});
