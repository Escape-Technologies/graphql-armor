import {ArmorPlugin} from './ArmorPlugin';
import {PluginDefinition} from './types';

export class DisableIntrospectionPlugin extends ArmorPlugin {
  apolloPatchConfig(config) {
    return {...config, introspection: false};
  }
}

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
