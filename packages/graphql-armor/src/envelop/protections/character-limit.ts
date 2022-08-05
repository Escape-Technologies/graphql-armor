import { CharacterLimitOptions, characterLimitPlugin } from '@escape.tech/graphql-armor-character-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCharacterLimitProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.characterLimit) return true;
    return this.config.characterLimit.enabled;
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
