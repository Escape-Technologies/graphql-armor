import type { Plugin as EnvelopPlugin } from '@envelop/core';

import { GraphQLArmorConfig } from '../../config';

export type EnvelopConfigurationEnhancement = {
  plugins: EnvelopPlugin[];
};

export abstract class EnvelopProtection {
  config: GraphQLArmorConfig;
  enabledByDefault: boolean = true;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): EnvelopConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
