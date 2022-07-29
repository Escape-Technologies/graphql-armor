import { ArmorPlugin } from '../ArmorPlugin';
import { PluginConfig, PluginDefinition } from '../types';

export type IntrospectionConfig = { Introspection?: PluginConfig };
export const DefaultIntrospectionConfig = {
  _namespace: 'Introspection',
  enabled: false,
  options: {
    headersWhitelist: {
      'x-allow-introspection': 'allow',
      ...(process.env.ESCAPE_IDENTIFIER
        ? { 'x-escape-identifier': process.env.ESCAPE_IDENTIFIER }
        : {}),
    },
  },
};

const plugin = ({
  options: { headersWhitelist },
}: PluginConfig): PluginDefinition => {
  const whitelist = headersWhitelist.map((header) => header.toLowerCase());

  return {
    async requestDidStart({ request }) {
      if (request.query!.includes('__schema')) {
        const headers = request.http!.headers;

        const whitelistedHeaders = whitelist.filter((header) =>
          headers.has(header)
        );

        if (whitelistedHeaders.length === 0) {
          throw new Error('Introspection is disabled');
        }
      }
    },
  };
};

export class Introspection extends ArmorPlugin {
  getApolloPlugins(): PluginDefinition[] {
    return [plugin(this.getConfig())];
  }
}
