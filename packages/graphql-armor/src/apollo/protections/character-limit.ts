import type { GraphQLRequestContext } from 'apollo-server-types';
import { GraphQLError } from 'graphql';

import { CharacterLimitOptions } from '../../config';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const plugin = ({ maxLength }: CharacterLimitOptions) => {
  return {
    async requestDidStart(context: GraphQLRequestContext) {
      if (!context.request.query) return;
      if (context.request.query.length > maxLength) {
        throw new GraphQLError('Query is too large', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },
  };
};

export class ApolloCharacterLimitProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.characterLimit) return true;
    return this.config.characterLimit.enabled;
  }

  get options(): CharacterLimitOptions {
    return {
      maxLength: this.config.characterLimit?.options?.maxLength || 15000,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
