import { MaxAliasesOptions, maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxAliasesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.maxAliases) {
      return this.enabledByDefault;
    }
    return this.config.maxAliases.enabled ?? this.enabledByDefault;
  }

  get options(): MaxAliasesOptions {
    return {
      n: this.config.maxAliases?.n || 15,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxAliasesPlugin(this.options)],
    };
  }
}
