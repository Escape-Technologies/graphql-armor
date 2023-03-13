import type { ApolloServerOptions, BaseContext } from '@apollo/server';
import type { GraphQLArmorConfig } from '@escape.tech/graphql-armor-types';

export type ApolloServerConfigurationEnhancement = {
  plugins?: ApolloServerOptions<BaseContext>['plugins'];
  validationRules?: ApolloServerOptions<BaseContext>['validationRules'];
};

export abstract class ApolloProtection {
  config: GraphQLArmorConfig;
  enabledByDefault = true;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): ApolloServerConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
