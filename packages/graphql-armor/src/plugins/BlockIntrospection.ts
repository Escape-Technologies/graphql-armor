import { ArmorPlugin } from '../ArmorPlugin';
import { PluginConfig } from '../types';
import { PluginDefinition } from 'apollo-server-core/src/types';

export type BlockIntrospectionConfig = { BlockIntrospection?: PluginConfig };
export const DefaultBlockIntrospectionConfig = {
  _namespace: 'BlockIntrospection',
  enabled: false,
  options: {
    headersWhitelist: {
      'x-allow-introspection': 'allow',
      ...(process.env.ESCAPE_IDENTIFIER ? { 'x-escape-identifier': process.env.ESCAPE_IDENTIFIER } : {}),
    },
  },
};

const plugin = ({ options: { headersWhitelist } }: PluginConfig): PluginDefinition => {
  return {
    async requestDidStart({ request }) {
      if (request.query!.includes('__schema')) {
        const headers = request.http!.headers;

        let containsWhitelistedHeader = false;
        for (const key in headersWhitelist) {
          if (headers.has(key)) {
            if (headersWhitelist[key] === headers.get(key)) {
              containsWhitelistedHeader = true;
            }
          }
        }

        if (!containsWhitelistedHeader) {
          throw new Error('Introspection is disabled');
        }
      }
    },
  };
};

export class BlockIntrospection extends ArmorPlugin {
  getApolloPlugins(): PluginDefinition[] {
    return [plugin(this.getConfig())];
  }
}
