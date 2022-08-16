import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDepthProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.maxDepth) {
      return this.enabledByDefault;
    }
    return this.config.maxDepth.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxDepthPlugin(this.config.maxDepth)],
    };
  }
}
