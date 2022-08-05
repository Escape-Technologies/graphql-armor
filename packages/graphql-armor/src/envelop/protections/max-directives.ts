import {
  MaxDirectivesOptions,
  maxDirectivesOptionsDefaults,
  maxDirectivesPlugin,
} from '@escape.tech/graphql-armor-max-directives';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopMaxDirectivesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxDirectives) return true;
    return this.config.maxDirectives.enabled;
  }

  get options(): MaxDirectivesOptions {
    return {
      ...maxDirectivesOptionsDefaults,
      ...this.config.maxDirectives,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [maxDirectivesPlugin(this.options)],
    };
  }
}
