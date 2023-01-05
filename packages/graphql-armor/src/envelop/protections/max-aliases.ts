import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxAliasesProtection<
  PluginContext extends Record<string, unknown>,
> extends EnvelopProtection<PluginContext> {
  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxAliasesPlugin(this.config.maxAliases)],
    };
  }
}
