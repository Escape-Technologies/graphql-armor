import type { PluginDefinition } from 'apollo-server-core';
import { ApolloServerConfigurationEnhancement, ApolloProtection } from './base-protection';

const plugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        for (const error of requestContext.errors) {
          error.message = error.message.replace(/Did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
        }
      },
    };
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
