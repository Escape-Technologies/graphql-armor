import { costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCostLimitProtection<
  PluginContext extends Record<string, unknown>,
> extends EnvelopProtection<PluginContext> {
  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [costLimitPlugin(this.config.costLimit)],
    };
  }
}
