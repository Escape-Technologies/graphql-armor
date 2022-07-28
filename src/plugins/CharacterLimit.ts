import { ArmorPlugin } from '../ArmorPlugin';
import { PluginDefinition } from '../types';

// TODO : requestDidStart happens after parsing, right ...?
// (this is an issue)
export class CharacterLimitPlugin extends ArmorPlugin {
  getApolloPlugins(): PluginDefinition[] {
    const characterLimitPlugin = {
      async requestDidStart(context) {
        if (context.request.query.length > 3000) {
          throw new Error('Query too large.');
        }
      },
    };

    return [characterLimitPlugin];
  }
}
