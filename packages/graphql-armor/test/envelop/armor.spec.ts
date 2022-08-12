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

  it('should not include disabled plugins', () => {
    const envelopDisabled = new EnvelopArmor({
      blockFieldSuggestion: {
        enabled: false,
      },
      characterLimit: {
        enabled: false,
      },
      costLimit: {
        enabled: false,
      },
      maxAliases: {
        enabled: false,
      },
      maxDepth: {
        enabled: false,
      },
      maxDirectives: {
        enabled: false,
      },
    });

    const enhancementsDisabled = envelopDisabled.protect();
    expect(enhancementsDisabled.plugins.length).toEqual(0);
  });
});
