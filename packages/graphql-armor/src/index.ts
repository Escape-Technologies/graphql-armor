import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from 'config';
import {
  BlockFieldSuggestionProtection,
  CharacterLimitProtection,
  CostAnalysisProtection,
  Protection,
} from './plugins';

class ApolloArmor {
  private config: GraphQLArmorConfig;

  private readonly protections: Protection[];

  constructor(config: GraphQLArmorConfig = {}) {
    this.config = config;

    this.protections = [
      new BlockFieldSuggestionProtection(config),
      new CharacterLimitProtection(config),
      new CostAnalysisProtection(config),
    ];
  }

  public protect(apolloConfig: ApolloServerConfig): ApolloServerConfig {
    let finalApolloConfig = apolloConfig;

    for (const protection of this.protections) {
      if (protection.isEnabled) finalApolloConfig = protection.protect(finalApolloConfig);
    }

    return finalApolloConfig;
  }
}

export { ApolloArmor };
