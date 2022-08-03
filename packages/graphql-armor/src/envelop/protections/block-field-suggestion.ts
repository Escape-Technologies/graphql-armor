import { useErrorHandler } from '@envelop/core';
import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

// @TODO: fix this
const plugin = useErrorHandler((errors) => {
  console.log(errors);
  for (const error of errors) {
    console.log(error.message);
    error.message = error.message.replace(/Did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
  }
  console.log(errors);
  return errors;
});

export class EnvelopBlockFieldSuggestionProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin],
    };
  }
}
