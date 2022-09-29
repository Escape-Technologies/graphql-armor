import { MaxTokensOptions, MaxTokensParserWLexer, maxTokenDefaultOptions } from '@escape.tech/graphql-armor-max-tokens';
import { GraphQLRequestContext } from 'apollo-server-types';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const plugin = (options: MaxTokensOptions) => {
  return {
    async requestDidStart() {
      return {
        async parsingDidStart(requestContext: GraphQLRequestContext) {
          const source = requestContext.source;
          if (source !== undefined) {
            const parser = new MaxTokensParserWLexer(source, options);
            parser.parseDocument();
          }
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
