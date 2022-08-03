import { Plugin } from '@envelop/core';
import { GraphQLArmorConfig } from '../../config';

export type ProtectionConfiguration<Options = never> = {
  enabled: boolean;
  options?: Options;
};

export type EnvelopConfigurationEnhancement = {
  plugins: Plugin[];
};

export abstract class EnvelopProtection {
  config: GraphQLArmorConfig;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): EnvelopConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
