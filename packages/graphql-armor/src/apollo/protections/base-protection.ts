import type { Config as ApolloServerConfig } from 'apollo-server-core';

import { GraphQLArmorConfig } from '../../config';

export type ApolloServerConfigurationEnhancement = {
  plugins?: ApolloServerConfig['plugins'];
  validationRules?: ApolloServerConfig['validationRules'];
};

export abstract class ApolloProtection {
  config: GraphQLArmorConfig;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): ApolloServerConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
