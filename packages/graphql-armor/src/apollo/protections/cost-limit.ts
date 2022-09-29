import { costLimitRule } from '@escape.tech/graphql-armor-cost-limit';

import { badInputHandlerSelector } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloCostLimitProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.costLimit) {
      return this.enabledByDefault;
    }
    return this.config.costLimit.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    this.config.costLimit = badInputHandlerSelector<typeof this.config.costLimit>(this.config.costLimit);

    return {
      validationRules: [costLimitRule(this.config.costLimit)],
    };
  }
}
