import { maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';

import { badInputContextHandler, badInputHandler } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxAliasesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxAliases) {
      return this.enabledByDefault;
    }
    return this.config.maxAliases.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    if (this.config.maxAliases == undefined) {
      this.config.maxAliases = {};
    }

    if (this.config.maxAliases.onReject == undefined) {
      this.config.maxAliases.onReject = [];
    }

    if (this.config.maxAliases.throwRejection === undefined || this.config.maxAliases.throwRejection) {
      this.config.maxAliases.onReject.push(badInputHandler);
    } else {
      this.config.maxAliases.onReject.push(badInputContextHandler);
    }

    return {
      validationRules: [maxAliasesRule(this.config.maxAliases)],
    };
  }
}
