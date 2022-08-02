import { type GraphQLRequestContext } from 'apollo-server-types';
import { ArmorPlugin } from '../ArmorPlugin';
import { type PluginConfig } from '../types';
import { type PluginDefinition as ApolloPlugin } from 'apollo-server-core/src/types';
import { EnvelopError, type Plugin as EnvelopPlugin } from '@envelop/core';

export type CharacterLimitConfig = {
  CharacterLimit?: { options?: { maxLength: number } } & PluginConfig;
};
export const DefaultCharacterLimitConfig = {
  _namespace: 'CharacterLimit',
  enabled: true,
  options: {
    maxLength: 15000,
  },
};

const apollo_plugin = ({ options: { maxLength } }: PluginConfig) => {
  return {
    async requestDidStart(context: GraphQLRequestContext) {
      if (context.request.query!.length > maxLength) {
        throw new Error('Query too large.');
      }
    },
  };
};

const envelop_plugin = ({ options: { maxLength } }: PluginConfig) => {
  return {
    onParse({ params }) {
      console.log(params);
      // if (context.request.query!.length > maxLength) {
      //   throw new EnvelopError('Query too large.');
      // }
    },
  };
};

export class CharacterLimit extends ArmorPlugin {
  getApolloPlugins(): ApolloPlugin[] {
    return [apollo_plugin(this.getConfig())];
  }

  getEnvelopPlugins(): EnvelopPlugin[] {
    return [envelop_plugin(this.getConfig())];
  }
}
