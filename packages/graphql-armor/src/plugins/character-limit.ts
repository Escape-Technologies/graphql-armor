import { GraphQLRequestContext } from 'apollo-server-types';
import { ApolloError, Config as ApolloServerConfig } from 'apollo-server-core';
import { ApolloServerConfigurationEnhancement, Protection } from './base-protection';
import { CharacterLimitOptions } from './protection-options';

const plugin = ({ maxLength }: CharacterLimitOptions) => {
  return {
    async requestDidStart(context: GraphQLRequestContext) {
      if (!context.request.query) return;
      if (context.request.query.length > maxLength) {
        throw new ApolloError('Query too large.', 'BAD_USER_INPUT');
      }
    },
  };
};

export class CharacterLimitProtection extends Protection {
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
