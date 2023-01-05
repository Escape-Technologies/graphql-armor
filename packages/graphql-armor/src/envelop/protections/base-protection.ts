import type { Plugin as EnvelopPlugin } from '@envelop/core';

import { GraphQLArmorConfig } from '../../config';

export type EnvelopConfigurationEnhancement<PluginContext extends Record<string, unknown>> = {
  plugins: EnvelopPlugin<PluginContext>[];
};

export abstract class EnvelopProtection<PluginContext extends Record<string, unknown>> {
  config: GraphQLArmorConfig<PluginContext>;

  constructor(config: GraphQLArmorConfig<PluginContext>) {
    this.config = config;
  }

  abstract protect(): EnvelopConfigurationEnhancement<PluginContext>;
}
