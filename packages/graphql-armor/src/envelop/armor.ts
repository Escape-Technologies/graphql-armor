import type { Plugin } from '@envelop/core';

import { GraphQLArmorConfig } from '../config';
import { EnvelopProtection } from './protections/base-protection';
import { EnvelopBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { EnvelopCharacterLimitProtection } from './protections/character-limit';
import { EnvelopCostLimitProtection } from './protections/cost-limit';
import { EnvelopMaxAliasesProtection } from './protections/max-aliases';
import { EnvelopMaxDepthProtection } from './protections/max-depth';
import { EnvelopMaxDirectivesProtection } from './protections/max-directives';

export class EnvelopArmor {
  private config: GraphQLArmorConfig;

  private readonly protections: EnvelopProtection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.config = config;

    this.protections = [
      new EnvelopBlockFieldSuggestionProtection(config),
      new EnvelopCharacterLimitProtection(config),
      new EnvelopMaxDepthProtection(config),
      new EnvelopMaxAliasesProtection(config),
      new EnvelopMaxDirectivesProtection(config),
      new EnvelopCostLimitProtection(config),
    ];
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
