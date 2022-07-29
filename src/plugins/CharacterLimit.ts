import { GraphQLRequestContext } from 'apollo-server-types';
import { ArmorPlugin } from '../ArmorPlugin';
import { PluginDefinition, PluginConfig } from '../types';

// TODO : requestDidStart happens after parsing, right ...?
// (this is an issue)

export type CharacterLimitConfig = {
  CharacterLimit?: { options: { maxLength: number } } & PluginConfig;
};
export const DefaultCharacterLimitConfig = {
  _namespace: 'CharacterLimit',
  enabled: true,
  options: {
    maxLength: 3000,
  },
};

const plugin = ({ options: { maxLength } }: PluginConfig) => {
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
    return [plugin(this.getConfig())];
  }
}
