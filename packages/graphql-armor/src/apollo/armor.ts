import type { Config as ApolloServerConfig, PluginDefinition, ValidationRule } from 'apollo-server-core';

import { GraphQLArmorConfig } from '../config';
import { ApolloRewriteHTTPCode } from './internal/rewrite-http-code';
import { ApolloProtection } from './protections/base-protection';
import { ApolloBlockFieldSuggestionProtection } from './protections/block-field-suggestion';
import { ApolloCostLimitProtection } from './protections/cost-limit';
import { ApolloMaxAliasesProtection } from './protections/max-aliases';
import { ApolloMaxDepthProtection } from './protections/max-depth';
import { ApolloMaxDirectivesProtection } from './protections/max-directives';
import { ApolloMaxTokensProtection } from './protections/max-tokens';

export class ApolloArmor {
  private _protections: ApolloProtection[];
  private _config: GraphQLArmorConfig;

  constructor(config: GraphQLArmorConfig = {}) {
    this._config = config;
    this._protections = [
      new ApolloBlockFieldSuggestionProtection(config),
      new ApolloMaxTokensProtection(config),
      new ApolloCostLimitProtection(config),
      new ApolloMaxAliasesProtection(config),
      new ApolloMaxDirectivesProtection(config),
      new ApolloMaxDepthProtection(config),
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

    for (const protection of this._protections) {
      if (protection.isEnabled) {
        const { plugins: newPlugins, validationRules: newValidationRules } = protection.protect();
        plugins = [...plugins, ...(newPlugins || [])];
        validationRules = [...validationRules, ...(newValidationRules || [])];
      }
    }

    /* Load the rewrite HTTP code plugin last, if any validationRule has been added */
    if (validationRules.length > 0) {
      this._protections = [...this._protections, new ApolloRewriteHTTPCode(this._config)];
      if (this._protections[this._protections.length - 1].isEnabled) {
        const { plugins: newPlugins } = this._protections[this._protections.length - 1].protect();
        plugins = [...plugins, ...(newPlugins || [])];
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
