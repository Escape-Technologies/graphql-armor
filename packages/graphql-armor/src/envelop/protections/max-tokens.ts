import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxTokensProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.maxTokens) {
      return this.enabledByDefault;
    }
    return this.config.maxTokens.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxTokensPlugin(this.config.maxTokens)],
    };
  }
}
