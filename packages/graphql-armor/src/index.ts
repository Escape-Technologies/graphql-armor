import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLArmorConfig } from './config';
import { Protection } from './plugins/base-protection';
import { BlockFieldSuggestionProtection } from './plugins/block-field-suggestion';
import { CharacterLimitProtection } from './plugins/character-limit';
import { CostAnalysisProtection } from './plugins/cost-analysis';

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
