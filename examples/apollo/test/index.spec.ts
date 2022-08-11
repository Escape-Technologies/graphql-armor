import { describe, expect, it } from '@jest/globals';
import { GraphQLError } from 'graphql';

import { server } from '../src/server';

describe('startup', () => {
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  (async () => {
    await server.start();
  })();

  it('should block field suggestion', async () => {
    const query = await server.executeOperation({
      query: `
      query {
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

  it('should block too large query', async () => {
    try {
      const query = await server.executeOperation({
        query: `
        query {
          books {
            title
            author
          } ${' '.repeat(1000)}
        }`,
      });
    } catch (e) {
      expect(e.message).toContain('Query is too large');
    }
  });
});
