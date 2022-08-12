import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopBlockFieldSuggestionProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.blockFieldSuggestion) {
      return this.enabledByDefault;
    }
    return this.config.blockFieldSuggestion.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [blockFieldSuggestionsPlugin()],
    };
  }
}
