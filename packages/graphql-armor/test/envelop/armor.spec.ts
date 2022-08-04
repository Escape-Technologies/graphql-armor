import { EnvelopArmor } from '../../src/envelop/armor';
import { describe, it, expect } from '@jest/globals';

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
    expect(enhancements.plugins.length).toEqual(2);
  });
});
