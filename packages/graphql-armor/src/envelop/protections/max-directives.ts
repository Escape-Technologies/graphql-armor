import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDirectivesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxDirectivesPlugin(this.config.maxDirectives)],
    };
  }
}
