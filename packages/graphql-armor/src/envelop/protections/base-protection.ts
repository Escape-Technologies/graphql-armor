import type { Plugin as EnvelopPlugin } from '@envelop/core';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';

export type EnvelopConfigurationEnhancement = {
  plugins: EnvelopPlugin[];
};

export abstract class EnvelopProtection {
  config: GraphQLArmorConfig;
  enabledByDefault = true;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): EnvelopConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
