import { describe, expect, it } from '@jest/globals';
import { getIntrospectionQuery } from 'graphql';
import request from 'supertest';

import { initServer } from '../src/server';

describe('startup', () => {
  const server = initServer();
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  it('should allow introspection', async () => {
    const response = await request(server).post('/graphql').send({
      query: getIntrospectionQuery(),
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.data).toBeDefined();
    expect(body.data?.__schema).toBeDefined();
    expect(body.errors).toBeUndefined();
  });
});
