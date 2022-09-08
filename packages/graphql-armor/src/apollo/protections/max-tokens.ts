import { MaxTokensOptions, MaxTokensParserWLexer, maxTokenDefaultOptions } from '@escape.tech/graphql-armor-max-tokens';
import { GraphQLRequestContext } from 'apollo-server-types';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const plugin = ({ n }: MaxTokensOptions) => {
  const _n = n ?? maxTokenDefaultOptions.n;
  return {
    async requestDidStart() {
      return {
        async parsingDidStart(requestContext: GraphQLRequestContext) {
          const source = requestContext.source;
          const parser = new MaxTokensParserWLexer(source, { n: _n });
          parser.parseDocument();
        },
      };
    },
  };
};

export class ApolloMaxTokensProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.maxTokens) {
      return this.enabledByDefault;
    }
    return this.config.maxTokens.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [plugin(this.config.maxTokens ?? maxTokenDefaultOptions)],
    };
  }
}
