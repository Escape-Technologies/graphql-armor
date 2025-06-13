import type { Plugin } from '@envelop/core';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';

import { EnvelopProtection } from './protections/base-protection';
import { EnvelopBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { EnvelopCostLimitProtection } from './protections/cost-limit';
import { EnvelopMaxAliasesProtection } from './protections/max-aliases';
import { EnvelopMaxDepthProtection } from './protections/max-depth';
import { EnvelopMaxDirectivesProtection } from './protections/max-directives';
import { EnvelopMaxTokensProtection } from './protections/max-tokens';

export const EnvelopArmorPlugin = <PluginContext extends Record<string, any> = {}>(
  config?: GraphQLArmorConfig,
): Plugin<PluginContext> => {
  const armor = new EnvelopArmor<PluginContext>(config);
  const enhancements = armor.protect();

  return {
    onPluginInit({ addPlugin }) {
      for (const plugin of enhancements.plugins) {
        addPlugin(plugin);
      }
    },
  };
};

export class EnvelopArmor<PluginContext extends Record<string, any> = {}> {
  private readonly protections: EnvelopProtection<PluginContext>[];

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
    plugins: Plugin<PluginContext>[];
  } {
    const plugins: Plugin<PluginContext>[] = [];

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
