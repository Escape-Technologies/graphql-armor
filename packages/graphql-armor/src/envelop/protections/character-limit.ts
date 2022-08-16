import { CharacterLimitOptions, characterLimitPlugin } from '@escape.tech/graphql-armor-character-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCharacterLimitProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.characterLimit) {
      return this.enabledByDefault;
    }
    return this.config.characterLimit.enabled ?? this.enabledByDefault;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [characterLimitPlugin(this.config.characterLimit as CharacterLimitOptions)],
    };
  }
}
