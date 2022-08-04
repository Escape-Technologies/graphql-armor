import type { GraphQLRequestContext } from 'apollo-server-types';
import { ApolloServerConfigurationEnhancement, ApolloProtection } from './base-protection';
import { CharacterLimitOptions } from '../../config';
import { GraphQLError } from 'graphql';

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
