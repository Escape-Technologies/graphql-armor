import { costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCostLimitProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.costLimit) {
      return this.enabledByDefault;
    }
    return this.config.costLimit.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [costLimitPlugin(this.config.costLimit)],
    };
  }
}
