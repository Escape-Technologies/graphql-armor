import type { ApolloServerOptions as ApolloServerConfig, ApolloServerPlugin as PluginDefinition } from '@apollo/server';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';
import type { ValidationRule } from 'graphql';

import { ApolloProtection } from './protections/base-protection';
import { ApolloBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { ApolloCostLimitProtection } from './protections/cost-limit';
import { ApolloMaxAliasesProtection } from './protections/max-aliases';
import { ApolloMaxDepthProtection } from './protections/max-depth';
import { ApolloMaxDirectivesProtection } from './protections/max-directives';
import { ApolloMaxTokensProtection } from './protections/max-tokens';

export class ApolloArmor {
  private readonly protections: ApolloProtection[];
  private readonly version: string;

  constructor(config: GraphQLArmorConfig = {}, version = '') {
    this.version = version;
    this.protections = [
      new ApolloBlockFieldSuggestionProtection(config),
      new ApolloMaxTokensProtection(config),
      new ApolloCostLimitProtection(config),
      new ApolloMaxAliasesProtection(config),
      new ApolloMaxDirectivesProtection(config),
      new ApolloMaxDepthProtection(config),
    ];
  }

  protect(): {
    plugins: any;
    validationRules: ValidationRule[];
    allowBatchedHttpRequests: false;
    includeStacktraceInErrorResponses: false;
  } {
    let plugins: ApolloServerConfig<{}>['plugins'] = [];
    let validationRules: ApolloServerConfig<{}>['validationRules'] = [];

    for (const protection of this.protections) {
      if (protection.isEnabled) {
        const { plugins: newPlugins, validationRules: newValidationRules } = protection.protect();

        if (this.version === 'v4') {
          plugins = [...plugins, ...((newPlugins as PluginDefinition[]) || [])];
        } else {
          plugins = [...plugins, ...(newPlugins || [])];
        }

        validationRules = [...validationRules, ...(newValidationRules || [])];
      }
    }
    return {
      plugins,
      validationRules,
      allowBatchedHttpRequests: false,
      includeStacktraceInErrorResponses: false,
    };
  }
}

export class ApolloV4Armor extends ApolloArmor {
  constructor(config: GraphQLArmorConfig = {}, version = 'v4') {
    super(config, version);
  }
}
