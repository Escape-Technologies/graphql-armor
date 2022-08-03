import { GraphQLArmorConfig } from '../config';
import { EnvelopProtection } from './protections/base-protection';
import type { Plugin } from '@envelop/core';
import { EnvelopBlockFieldSuggestionProtection } from './protections/block-field-suggestion';

export class EnvelopArmor {
  private config: GraphQLArmorConfig;

  private readonly protections: EnvelopProtection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.config = config;

    this.protections = [new EnvelopBlockFieldSuggestionProtection(config)];
  }

  protect(): {
    plugins: Plugin[];
  } {
    const plugins: Plugin[] = [];

    for (const protection of this.protections) {
      if (protection.isEnabled) {
        const enhancements = protection.protect();

        plugins.push(...enhancements.plugins);
      }
    }

    return {
      plugins,
    };
  }
}
