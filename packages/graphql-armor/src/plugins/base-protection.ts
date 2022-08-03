import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from '../config';

export type ProtectionConfiguration<Options = never> = {
  enabled: boolean;
  options?: Options;
};

export abstract class Protection {
  config: GraphQLArmorConfig;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(config: ApolloServerConfig): ApolloServerConfig;
  abstract get isEnabled(): boolean;

  applyValidationRules(
    originalConfig: ApolloServerConfig,
    validationRules: ApolloServerConfig['validationRules'] = [],
  ): ApolloServerConfig {
    return {
      ...originalConfig,
      validationRules: [...(originalConfig.validationRules || []), ...validationRules],
    };
  }

  applyPlugins(originalConfig: ApolloServerConfig, plugins: ApolloServerConfig['plugins'] = []): ApolloServerConfig {
    return {
      ...originalConfig,
      plugins: [...(originalConfig.plugins || []), ...plugins],
    };
  }
}
