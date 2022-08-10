import { describe, expect, it } from '@jest/globals';

import { server } from '../src/server';

describe('startup', () => {
  it('should configure', () => {
    expect(server).toBeDefined();
  });

  it('should start and stop', async () => {
    await server.start();
    await server.stop();
  });
});
