import { useMaskedErrors } from '@envelop/core';
import { GraphQLError } from 'graphql';
import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopBlockFieldSuggestionProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [
        useMaskedErrors({
          handleValidationErrors: true,
          formatError: (error: GraphQLError, _message, _isDev) => {
            error.message = error.message.replace(/Did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
            return error;
          },
        }),
      ],
    };
  }
}
