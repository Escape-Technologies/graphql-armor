import { MaxDirectivesOptions, maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDirectivesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  get options(): MaxDirectivesOptions {
    return {
      n: this.config.maxDirectives?.n || 50,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxDirectivesPlugin(this.options)],
    };
  }
}
