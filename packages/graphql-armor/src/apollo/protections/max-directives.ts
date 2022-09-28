import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';

import { badInputContextHandler, badInputHandler } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDirectivesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    if (this.config.maxDirectives == undefined) {
      this.config.maxDirectives = {};
    }

    if (this.config.maxDirectives.onReject == undefined) {
      this.config.maxDirectives.onReject = [];
    }

    if (this.config.maxDirectives.throwRejection === undefined || this.config.maxDirectives.throwRejection) {
      this.config.maxDirectives.onReject.push(badInputHandler);
    } else {
      this.config.maxDirectives.onReject.push(badInputContextHandler);
    }

    return {
      validationRules: [maxDirectivesRule(this.config.maxDirectives)],
    };
  }
}
