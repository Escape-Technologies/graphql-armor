import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from '../config';

export type ProtectionConfiguration<Options = never> = {
  enabled: boolean;
  options?: Options;
};

export type ApolloServerConfigurationEnhancement = {
  plugins?: ApolloServerConfig['plugins'];
  validationRules?: ApolloServerConfig['validationRules'];
};

export abstract class Protection {
  config: GraphQLArmorConfig;

  constructor(config: GraphQLArmorConfig) {
    this.config = config;
  }

  abstract protect(): ApolloServerConfigurationEnhancement;
  abstract get isEnabled(): boolean;
}
