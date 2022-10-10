import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';

import { inferApolloPropagator } from '../errors';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDirectivesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    this.config.maxDirectives = inferApolloPropagator<typeof this.config.maxDirectives>(this.config.maxDirectives);

    return {
      validationRules: [maxDirectivesRule(this.config.maxDirectives)],
    };
  }
}
