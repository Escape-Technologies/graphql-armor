import { describe, expect, it } from '@jest/globals';

import type { GraphQLArmorConfig } from '../src/index';
import { ApolloArmor, EnvelopArmor } from '../src/index';

describe('global', () => {
  it('should be defined', () => {
    expect(ApolloArmor).toBeDefined();
    expect(EnvelopArmor).toBeDefined();
  });

  it('should be defined', () => {
    const apollo = new ApolloArmor();
    expect(apollo).toBeDefined();

    const envelop = new EnvelopArmor();
    expect(envelop).toBeDefined();
  });

  it('should export the GraphQLArmorConfig globally, so can set custom typed configuration', () => {
    const config: GraphQLArmorConfig = { maxDepth: { enabled: false, n: 1 } };

    expect(config).toBeDefined();
    expect(config.maxDepth?.enabled).toBeFalsy();
  });
});
