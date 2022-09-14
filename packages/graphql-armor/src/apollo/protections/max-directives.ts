import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDirectivesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxDirectivesRule((message: string) => {
          return new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }, this.config.maxDirectives),
      ],
    };
  }
}
