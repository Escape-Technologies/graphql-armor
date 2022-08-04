import type { Config as ApolloServerConfig, PluginDefinition, ValidationRule } from 'apollo-server-core';
import { GraphQLArmorConfig } from '../config';
import { ApolloProtection } from './protections/base-protection';
import { ApolloBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { ApolloCharacterLimitProtection } from './protections/character-limit';
import { ApolloCostAnalysisProtection } from './protections/cost-analysis';

export class ApolloArmor {
  private config: GraphQLArmorConfig;

  private readonly protections: ApolloProtection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.config = config;

    this.protections = [
      new ApolloBlockFieldSuggestionProtection(config),
      new ApolloCharacterLimitProtection(config),
      new ApolloCostAnalysisProtection(config),
    ];
  }

  protect(): {
    plugins: PluginDefinition[];
    validationRules: ValidationRule[];
    allowBatchedHttpRequests: false;
    debug: false;
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
      allowBatchedHttpRequests: false,
      debug: false,
    };
  }
}
