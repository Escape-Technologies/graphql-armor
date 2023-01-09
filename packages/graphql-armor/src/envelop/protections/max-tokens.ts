import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxTokensProtection<
  PluginContext extends Record<string, unknown>,
> extends EnvelopProtection<PluginContext> {
  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxTokensPlugin(this.config.maxTokens)],
    };
  }
}
