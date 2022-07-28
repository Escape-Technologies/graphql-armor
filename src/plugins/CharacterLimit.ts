import { GraphQLRequestContext } from 'apollo-server-types';
import { ArmorPlugin } from '../ArmorPlugin';
import { PluginDefinition } from '../types';

// TODO : requestDidStart happens after parsing, right ...?
// (this is an issue)

const characterLimitPlugin = {
  async requestDidStart(context: GraphQLRequestContext) {
    if (context.request.query!.length > 3000) {
      throw new Error('Query too large.');
    }
  },
};

export class CharacterLimit extends ArmorPlugin {
  getApolloPlugins(): PluginDefinition[] {
    return [characterLimitPlugin];
  }
}
