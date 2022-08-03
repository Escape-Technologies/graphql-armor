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
