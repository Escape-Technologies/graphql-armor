import type { OnPluginInitEventPayload, Plugin } from '@envelop/core';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';

import { EnvelopProtection } from './protections/base-protection';
import { EnvelopBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { EnvelopCostLimitProtection } from './protections/cost-limit';
import { EnvelopMaxAliasesProtection } from './protections/max-aliases';
import { EnvelopMaxDepthProtection } from './protections/max-depth';
import { EnvelopMaxDirectivesProtection } from './protections/max-directives';
import { EnvelopMaxTokensProtection } from './protections/max-tokens';

export const EnvelopArmorPlugin = (config?: GraphQLArmorConfig): Plugin => {
  const armor = new EnvelopArmor(config);
  const enhancements = armor.protect();

  return {
    onPluginInit({ addPlugin }: OnPluginInitEventPayload) {
      for (const plugin of enhancements.plugins) {
        addPlugin(plugin);
      }
    },
  };
};

export class EnvelopArmor {
  private readonly protections: EnvelopProtection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.protections = [
      new EnvelopBlockFieldSuggestionProtection(config),
      new EnvelopMaxTokensProtection(config),
      new EnvelopMaxDirectivesProtection(config),
      new EnvelopMaxAliasesProtection(config),
      new EnvelopCostLimitProtection(config),
      new EnvelopMaxDepthProtection(config),
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
