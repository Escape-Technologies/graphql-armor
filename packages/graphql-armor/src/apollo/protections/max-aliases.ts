import { maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';

import { injectRequestContextRule } from '../context-helper';
import { inferApolloPropagator } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxAliasesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxAliases) {
      return this.enabledByDefault;
    }
    return this.config.maxAliases.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    this.config.maxAliases = inferApolloPropagator<typeof this.config.maxAliases>(this.config.maxAliases);

    return {
      validationRules: [injectRequestContextRule(maxAliasesRule(this.config.maxAliases))],
    };
  }
}
