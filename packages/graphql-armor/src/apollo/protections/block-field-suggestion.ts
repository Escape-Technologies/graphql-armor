import type { PluginDefinition } from 'apollo-server-core';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

const patch = {
  async didEncounterErrors({ errors }: { errors: ReadonlyArray<GraphQLError> }) {
    for (const error of errors) {
      error.message = error.message.replace(/Did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
    }
  },
};

const plugin: PluginDefinition = {
  async requestDidStart() {
    return patch;
  },
};

export class ApolloBlockFieldSuggestionProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [plugin],
    };
  }
}
