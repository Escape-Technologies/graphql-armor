import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';

import { badInputContextHandler, badInputHandler } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDepthProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDepth) {
      return this.enabledByDefault;
    }
    return this.config.maxDepth.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    if (this.config.maxDepth == undefined) {
      this.config.maxDepth = {};
    }

    if (this.config.maxDepth.onReject == undefined) {
      this.config.maxDepth.onReject = [];
    }

    if (this.config.maxDepth.throwRejection === undefined || this.config.maxDepth.throwRejection) {
      this.config.maxDepth.onReject.push(badInputHandler);
    } else {
      this.config.maxDepth.onReject.push(badInputContextHandler);
    }

    return {
      validationRules: [maxDepthRule(this.config.maxDepth)],
    };
  }
}
