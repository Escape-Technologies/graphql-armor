import type { OnPluginInitEventPayload, Plugin } from '@envelop/core';

import { GraphQLArmorConfig } from '../config';
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

export class EnvelopArmor<PluginContext extends Record<string, unknown>> {
  private readonly protections: EnvelopProtection<PluginContext>[];

  constructor(config: GraphQLArmorConfig<PluginContext> = {}) {
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
      const enhancements = protection.protect();
      plugins.push(...enhancements.plugins);
    }

    return {
      plugins,
    };
  }
}
