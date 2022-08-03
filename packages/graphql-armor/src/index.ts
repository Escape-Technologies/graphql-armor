import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from './config';
import { Protection } from './plugins/base-protection';
import { BlockFieldSuggestionProtection } from './plugins/block-field-suggestion';
import { CharacterLimitProtection } from './plugins/character-limit';
import { CostAnalysisProtection } from './plugins/cost-analysis';

class ApolloArmor {
  private config: GraphQLArmorConfig;

  private readonly protections: Protection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.config = config;

    this.protections = [
      new BlockFieldSuggestionProtection(config),
      new CharacterLimitProtection(config),
      new CostAnalysisProtection(config),
    ];
  }

  protect(): {
    plugins: ApolloServerConfig['plugins'];
    validationRules: ApolloServerConfig['validationRules'];
  } {
    let plugins: ApolloServerConfig['plugins'] = [];
    let validationRules: ApolloServerConfig['validationRules'] = [];

    for (const protection of this.protections) {
      if (protection.isEnabled) {
        const { plugins: newPlugins, validationRules: newValidationRules } = protection.protect();
        plugins = [...plugins, ...(newPlugins || [])];
        validationRules = [...validationRules, ...(newValidationRules || [])];
      }
    }

    return {
      plugins,
      validationRules,
    };
  }
}

export { ApolloArmor };
