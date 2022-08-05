import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopBlockFieldSuggestionProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [blockFieldSuggestionsPlugin()],
    };
  }
}
