import { describe, expect, it } from '@jest/globals';

import { ApolloArmor } from '../../src/apollo/armor';

describe('apolloArmor', () => {
  const apollo = new ApolloArmor();
  it('should be defined', () => {
    expect(apollo).toBeDefined();
  });

  const enhancements = apollo.protect();
  it('should be defined', () => {
    expect(enhancements).toBeDefined();
  });

  it('should have property', () => {
    expect(enhancements).toHaveProperty('plugins');
    expect(enhancements).toHaveProperty('validationRules');
    expect(enhancements).toHaveProperty('allowBatchedHttpRequests');
    expect(enhancements).toHaveProperty('debug');
  });

  it('should have property that equals', () => {
    expect(enhancements.plugins.length).toEqual(2);
    expect(enhancements.validationRules.length).toEqual(4);
    expect(enhancements.allowBatchedHttpRequests).toEqual(false);
    expect(enhancements.debug).toEqual(false);
  });
});
