import {
  BlockFieldSuggestionsOptions,
  blockFieldSuggestionsDefaultOptions,
} from '@escape.tech/graphql-armor-block-field-suggestions';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const plugin = ({ mask }: BlockFieldSuggestionsOptions) => {
  const _mask = mask ?? blockFieldSuggestionsDefaultOptions.mask;
  return {
    async requestDidStart() {
      return {
        async didEncounterErrors({ errors }: { errors: ReadonlyArray<GraphQLError> }) {
          for (const error of errors) {
            error.message = error.message.replace(/Did you mean ".+"/g, _mask);
          }
        },
      };
    },
  };
};

export class ApolloBlockFieldSuggestionProtection extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.blockFieldSuggestion) {
      return this.enabledByDefault;
    }
    return this.config.blockFieldSuggestion.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [plugin(this.config.blockFieldSuggestion ?? blockFieldSuggestionsDefaultOptions)],
    };
  }
}
