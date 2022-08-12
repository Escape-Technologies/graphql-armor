import { CharacterLimitOptions, characterLimitPlugin } from '@escape.tech/graphql-armor-character-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCharacterLimitProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.characterLimit) {
      return this.enabledByDefault;
    }
    return this.config.characterLimit.enabled ?? this.enabledByDefault;
  }

  get options(): CharacterLimitOptions {
    return {
      maxLength: this.config.characterLimit?.maxLength || 15000,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [characterLimitPlugin(this.options)],
    };
  }
}
