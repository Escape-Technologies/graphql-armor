import { ProtectionConfiguration } from './apollo/protections/base-protection';

export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type MaxDirectivesOptions = { n: number };
export type MaxDepthOptions = { n: number };
export type MaxAliasesOptions = { n: number };
export type CostAnalysisOptions = {
  maxCost: number;
  objectCost: number;
  scalarCost: number;
  depthCostFactor: number;
};

export type ProtectionOptions =
  | BlockFieldSuggestionOptions
  | CharacterLimitOptions
  | CostAnalysisOptions
  | MaxAliasesOptions
  | MaxDepthOptions
  | MaxDirectivesOptions;

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration<BlockFieldSuggestionOptions>;
  characterLimit?: ProtectionConfiguration<CharacterLimitOptions>;
  costAnalysis?: ProtectionConfiguration<CostAnalysisOptions>;
  maxAliases?: ProtectionConfiguration<MaxAliasesOptions>;
  maxDepth?: ProtectionConfiguration<MaxDepthOptions>;
  maxDirectives?: ProtectionConfiguration<MaxDirectivesOptions>;
};
