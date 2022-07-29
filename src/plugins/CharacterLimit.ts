import { GraphQLRequestContext } from 'apollo-server-types';
import { ArmorPlugin } from '../ArmorPlugin';
import { PluginDefinition, PluginConfig } from '../types';

// TODO : requestDidStart happens after parsing, right ...?
// (this is an issue)

export type CharacterLimitConfig = {
  CharacterLimit?: { options: { maxLength: number } } & PluginConfig;
};
export const DefaultCharacterLimitConfig = {
  namespace: 'CharacterLimit',
  enabled: true,
  options: {
    maxLength: 3000,
  },
};

const __plugin = (maxLength: number) => {
  return {
    async requestDidStart(context: GraphQLRequestContext) {
      if (context.request.query!.length > maxLength) {
        throw new Error('Query too large.');
      }
    },
  };
};

export class CharacterLimit extends ArmorPlugin {
  getApolloPlugins(): PluginDefinition[] {
    return [__plugin(this.getConfig().options.maxLength)];
  }
}
