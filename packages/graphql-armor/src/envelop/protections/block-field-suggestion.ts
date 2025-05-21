import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopBlockFieldSuggestionProtection<
  PluginContext extends Record<string, any> = {},
> extends EnvelopProtection<PluginContext> {
  get isEnabled(): boolean {
    if (!this.config.blockFieldSuggestion) {
      return this.enabledByDefault;
    }
    return this.config.blockFieldSuggestion.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement<PluginContext> {
    return {
      plugins: [blockFieldSuggestionsPlugin(this.config.blockFieldSuggestion)],
    };
  }
}
