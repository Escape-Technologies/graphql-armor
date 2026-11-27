import { beforeAll, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

/**
 * HTTP-level end-to-end tests: the armor default configuration must reject
 * abusive queries through the full NestJS / Apollo stack with clean GraphQL
 * errors (no stacktraces). HTTP statuses are intentionally not asserted:
 * Apollo Server maps validation failures to different statuses depending on
 * how the error reaches the HTTP layer.
 */
describe('nestjs e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  const post = (query: string) => request(app.getHttpServer()).post('/graphql').send({ query });

  // The example schema has flat books/author strings, so a deeply nested
  // (invalid) document is used: armor rules reject it before schema
  // validation runs, which is the behavior under test.
  const nested = (levels: number) => {
    let query = 'query { books';
    for (let i = 0; i < levels - 1; i++) {
      query += ' { author { books';
    }
    query += ' { title }';
    query += ' }'.repeat(2 * (levels - 1) + 1);
    return query;
  };

  const messages = (res: { body: { errors?: { message: string }[] } }) => (res.body.errors ?? []).map((e) => e.message);

  it('serves a plain query', async () => {
    const res = await post('{ books { title } }');
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.books).toHaveLength(2);
  });

  it('rejects too many aliases (default limit: 15)', async () => {
    const aliases = Array.from({ length: 16 }, (_, i) => `a${i}: books { title }`).join(' ');
    const res = await post(`{ ${aliases} }`);
    expect(messages(res)).toContain('Syntax Error: Aliases limit of 15 exceeded, found 16.');
  });

  it('rejects queries exceeding the depth limit (default limit: 6)', async () => {
    const res = await post(nested(8));
    expect(messages(res).some((m) => m.includes('depth limit of 6 exceeded'))).toBe(true);
  });

  it('rejects queries exceeding the token limit (default limit: 1000)', async () => {
    const res = await post(`{ ${Array(1051).join('a ')} }`);
    expect(messages(res)).toContain('Syntax Error: Token limit of 1000 exceeded.');
  });

  it('rejects queries exceeding the directive limit (default limit: 50)', async () => {
    const res = await post(`query { books ${'@a'.repeat(51)} { title } }`);
    expect(messages(res)).toContain('Syntax Error: Directives limit of 50 exceeded, found 51.');
  });

  it('rejects queries exceeding the cost limit (default limit: 5000)', async () => {
    // Deep nesting multiplies the cost by the depth factor; the cost rule runs
    // before the depth rule, so this rejects on cost even though the document
    // is also deeper than the depth limit.
    const res = await post(nested(25));
    expect(messages(res).some((m) => m.startsWith('Syntax Error: Query Cost limit of 5000 exceeded, found'))).toBe(
      true,
    );
  });

  it('hides field suggestions', async () => {
    const res = await post('{ books { titlee } }');
    expect(messages(res).some((m) => m.includes('Cannot query field "titlee"'))).toBe(true);
    expect(messages(res).some((m) => m.includes('[Suggestion hidden]'))).toBe(true);
    expect(messages(res).some((m) => m.includes('Did you mean'))).toBe(false);
  });

  it('does not leak stacktraces', async () => {
    const res = await post('{ books { titlee } }');
    expect(JSON.stringify(res.body)).not.toContain('stacktrace');
  });
});
