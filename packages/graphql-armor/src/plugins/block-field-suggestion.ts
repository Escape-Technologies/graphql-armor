import { Config as ApolloServerConfig, PluginDefinition } from 'apollo-server-core';
import { Protection } from 'plugins';

const plugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        for (const error of requestContext.errors) {
          if (error.message.toLowerCase().includes('did you mean'))
            error.message = error.message.replace(/did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
        }
      },
    };
  },
};

export type BlockFieldSuggestionOptions = undefined;
export class BlockFieldSuggestionProtection extends Protection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(apolloConfig: ApolloServerConfig): ApolloServerConfig {
    return this.applyPlugins(apolloConfig, [plugin]);
  }
}
