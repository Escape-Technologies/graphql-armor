import { describe, expect, it } from '@jest/globals';

import { EnvelopArmor } from '../../src/envelop/armor';

describe('envelopArmor', () => {
  const envelop = new EnvelopArmor();
  it('should be defined', () => {
    expect(envelop).toBeDefined();
  });

  const enhancements = envelop.protect();
  it('should be defined', () => {
    expect(enhancements).toBeDefined();
  });

  it('should have property', () => {
    expect(enhancements).toHaveProperty('plugins');
  });

  it('should have property that equals', () => {
    expect(enhancements.plugins.length).toEqual(6);
  });
});
