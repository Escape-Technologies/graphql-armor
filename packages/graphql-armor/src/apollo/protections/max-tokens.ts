import { MaxTokensOptions, maxTokenDefaultOptions } from '@escape.tech/graphql-armor-max-tokens';
import type { GraphQLRequestContext } from 'apollo-server-types';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const plugin = ({ n }: MaxTokensOptions) => {
  const _n = n ?? maxTokenDefaultOptions.n;
  return {
    async parsingDidStart({ request }: GraphQLRequestContext) {
      console.log('parsingDidStart', request);
      if (request.query.length > _n) {
        throw new GraphQLError(`Query is too long. Maximum allowed tokens is ${n}.`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },
  };
};

export class ApolloMaxTokensProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxTokens) {
      return this.enabledByDefault;
    }
    console.log('enabled', this.config.maxTokens.enabled);
    return this.config.maxTokens.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [
        plugin({
          n: this.config.maxTokens?.n,
        }),
      ],
    };
  }
}
