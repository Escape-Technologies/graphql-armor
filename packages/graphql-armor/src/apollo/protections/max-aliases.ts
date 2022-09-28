import { maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';

import { badInputHandlerSelector } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxAliasesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxAliases) {
      return this.enabledByDefault;
    }
    return this.config.maxAliases.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    this.config.maxAliases = badInputHandlerSelector(this.config.maxAliases);

    return {
      validationRules: [maxAliasesRule(this.config.maxAliases)],
    };
  }
}
