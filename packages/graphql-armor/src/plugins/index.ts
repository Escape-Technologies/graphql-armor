import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from 'config';
import { BlockFieldSuggestionOptions } from './block-field-suggestion';
import { CharacterLimitOptions } from './character-limit';
import { CostAnalysisOptions } from './cost-analysis';

export type ProtectionOptions = BlockFieldSuggestionOptions | CharacterLimitOptions | CostAnalysisOptions;

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

export { ProtectionConfiguration } from './protection-options';
export * from './character-limit';
export * from './cost-analysis';
export * from './block-field-suggestion';
