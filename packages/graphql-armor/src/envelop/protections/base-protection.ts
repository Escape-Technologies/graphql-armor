import type { Plugin as EnvelopPlugin } from '@envelop/core';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';

export type EnvelopConfigurationEnhancement<PluginContext extends Record<string, any> = {}> = {
  plugins: EnvelopPlugin<PluginContext>[];
};

export abstract class EnvelopProtection<PluginContext extends Record<string, any> = {}> {
  config: GraphQLArmorConfig;
  enabledByDefault = true;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): EnvelopConfigurationEnhancement<PluginContext>;
  abstract get isEnabled(): boolean;
}
