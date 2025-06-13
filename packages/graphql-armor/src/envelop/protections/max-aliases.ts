import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxAliasesProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.maxAliases) {
      return this.enabledByDefault;
    }
    return this.config.maxAliases.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxAliasesPlugin(this.config.maxAliases)],
    };
  }
}
