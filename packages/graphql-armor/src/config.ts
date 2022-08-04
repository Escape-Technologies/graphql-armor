import { ProtectionConfiguration } from './apollo/protections/base-protection';

export type MaxDirectivesOptions = {
  n: number;
};

export type MaxDepthOptions = {
  n: number;
};

export type MaxAliasesOptions = {
  n: number;
};

export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type CostAnalysisOptions = {
  maxCost: number;
  defaultComplexity: number;
  maxDepth: number;
  maxAlias: number;
  maxDirectives: number;
};

export type ProtectionOptions =
  | BlockFieldSuggestionOptions
  | CharacterLimitOptions
  | CostAnalysisOptions
  | MaxAliasesOptions
  | MaxDepthOptions
  | MaxDirectivesOptions;

export type GraphQLArmorConfig = {
  characterLimit?: ProtectionConfiguration<CharacterLimitOptions>;
  costAnalysis?: ProtectionConfiguration<CostAnalysisOptions>;
  blockFieldSuggestion?: ProtectionConfiguration<BlockFieldSuggestionOptions>;
};
