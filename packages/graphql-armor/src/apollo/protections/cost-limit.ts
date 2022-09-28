import { costLimitRule } from '@escape.tech/graphql-armor-cost-limit';

import { badInputContextHandler, badInputHandler } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloCostLimitProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.costLimit) {
      return this.enabledByDefault;
    }
    return this.config.costLimit.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    if (this.config.costLimit == undefined) {
      this.config.costLimit = {};
    }

    if (this.config.costLimit.onReject == undefined) {
      this.config.costLimit.onReject = [];
    }

    if (this.config.costLimit.throwRejection === undefined || this.config.costLimit.throwRejection) {
      this.config.costLimit.onReject.push(badInputHandler);
    } else {
      this.config.costLimit.onReject.push(badInputContextHandler);
    }

    return {
      validationRules: [costLimitRule(this.config.costLimit)],
    };
  }
}
