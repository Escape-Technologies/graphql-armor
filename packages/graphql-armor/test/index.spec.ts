import { describe, expect, it } from '@jest/globals';
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
});
