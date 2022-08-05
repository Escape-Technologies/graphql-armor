import { MaxDepthOptions, maxDepthOptionsDefaults, maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxDepthProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxDepth) return true;
    return this.config.maxDepth.enabled;
  }

  get options(): MaxDepthOptions {
    return {
      ...maxDepthOptionsDefaults,
      ...this.config,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxDepthRule(this.options, (message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }),
      ],
    };
  }
}
