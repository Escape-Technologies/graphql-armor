import { describe, expect, it } from '@jest/globals';

import { initServer } from '../src/server';

describe('startup', () => {
  const server = initServer();
  it('should configure', () => {
    expect(server).toBeDefined();
  });
});
