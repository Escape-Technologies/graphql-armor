import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDepthProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.maxDepth) {
      return this.enabledByDefault;
    }
    return this.config.maxDepth.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxDepthPlugin(this.config.maxDepth)],
    };
  }
}
