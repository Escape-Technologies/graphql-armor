import { describe, expect, it } from '@jest/globals';

import { initServer } from '../src/server';

describe('startup', () => {
  it('should configure', () => {
    expect(initServer()).toBeDefined();
  });
});
