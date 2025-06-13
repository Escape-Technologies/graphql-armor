import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDirectivesProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.maxDirectives) {
      return this.enabledByDefault;
    }
    return this.config.maxDirectives.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxDirectivesPlugin(this.config.maxDirectives)],
    };
  }
}
