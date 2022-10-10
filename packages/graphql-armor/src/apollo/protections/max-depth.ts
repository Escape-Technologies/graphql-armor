import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';

import { inferApolloPropagator } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDepthProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDepth) {
      return this.enabledByDefault;
    }
    return this.config.maxDepth.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    this.config.maxDepth = inferApolloPropagator<typeof this.config.maxDepth>(this.config.maxDepth);

    return {
      validationRules: [maxDepthRule(this.config.maxDepth)],
    };
  }
}
