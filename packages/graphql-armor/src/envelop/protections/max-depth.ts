import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDepthProtection<
  PluginContext extends Record<string, unknown>,
> extends EnvelopProtection<PluginContext> {
  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [maxDepthPlugin(this.config.maxDepth)],
    };
  }
}
