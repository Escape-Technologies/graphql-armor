import { MaxAliasesOptions, maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloMaxAliasesProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxAliases) return true;
    return this.config.maxAliases.enabled;
  }

  get options(): MaxAliasesOptions {
    return {
      n: this.config.maxAliases?.options?.n || 15,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxAliasesRule(this.options, (message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }),
      ],
    };
  }
}
