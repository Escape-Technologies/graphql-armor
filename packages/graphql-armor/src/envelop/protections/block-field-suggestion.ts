import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopBlockFieldSuggestionProtection<
  PluginContext extends Record<string, unknown>,
> extends EnvelopProtection<PluginContext> {
  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [blockFieldSuggestionsPlugin(this.config.blockFieldSuggestion)],
    };
  }
}
