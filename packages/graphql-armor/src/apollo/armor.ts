import type { ApolloServerOptions, ApolloServerPlugin, BaseContext } from '@apollo/server';
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

  constructor(config: GraphQLArmorConfig = {}) {
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
    plugins: ApolloServerPlugin[];
    validationRules: ValidationRule[];
    allowBatchedHttpRequests: false;
    includeStacktraceInErrorResponses: false;
  } {
    let plugins: ApolloServerOptions<BaseContext>['plugins'] = [];
    let validationRules: ApolloServerOptions<BaseContext>['validationRules'] = [];

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
      includeStacktraceInErrorResponses: false,
    };
  }
}
