import { GraphQLError } from 'graphql';
import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { hookErrors } from '../../internals/hookError';

export class EnvelopBlockFieldSuggestionProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [
        hookErrors({
          formatter: (error: GraphQLError): GraphQLError => {
            if (error instanceof GraphQLError) {
              error.message = error.message.replace(
                /Did you mean ".+"/g,
                '[Suggestion message hidden by GraphQLArmor]',
              );
            }
            return error as GraphQLError;
          },
        }),
      ],
    };
  }
}
