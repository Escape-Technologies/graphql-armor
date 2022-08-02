import { GraphQLRequestContext } from 'apollo-server-types';
import { ArmorPlugin } from '../ArmorPlugin';
import { PluginConfig } from '../types';
import { PluginDefinition } from 'apollo-server-core/src/types';

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
