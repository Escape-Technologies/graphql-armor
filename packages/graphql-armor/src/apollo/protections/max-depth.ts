import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDepthProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDepth) {
      return this.enabledByDefault;
    }
    return this.config.maxDepth.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxDepthRule((message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }, this.config.maxDepth),
      ],
    };
  }
}
