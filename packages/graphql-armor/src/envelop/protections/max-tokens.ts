import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxTokensProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.maxTokens) {
      return this.enabledByDefault;
    }
    return this.config.maxTokens.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxTokensPlugin(this.config.maxTokens)],
    };
  }
}
