import { ProtectionConfiguration } from './apollo/protections/base-protection';

export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type CostAnalysisOptions = {
  maxCost: number;
  defaultComplexity: number;
  maxDepth: number;
  maxAlias: number;
  maxDirectives: number;
};

export type ProtectionOptions = BlockFieldSuggestionOptions | CharacterLimitOptions | CostAnalysisOptions;

export type GraphQLArmorConfig = {
  characterLimit?: ProtectionConfiguration<CharacterLimitOptions>;
  costAnalysis?: ProtectionConfiguration<CostAnalysisOptions>;
  blockFieldSuggestion?: ProtectionConfiguration<BlockFieldSuggestionOptions>;
};
