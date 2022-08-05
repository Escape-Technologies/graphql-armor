import { MaxAliasesOptions, maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxAliasesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxAliases) return true;
    return this.config.maxAliases.enabled;
  }

  get options(): MaxAliasesOptions {
    return {
      n: this.config.maxAliases?.options?.n || 15,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxAliasesPlugin(this.options)],
    };
  }
}
