export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type CostAnalysisOptions = {

  maxCost: number;
  maxDepth: number;
  maxAlias: number;
  maxDirectives: number;

  objectCost: number;
  scalarCost: number;
  depthCostFactor: number;
};

export type ProtectionOptions = BlockFieldSuggestionOptions | CharacterLimitOptions | CostAnalysisOptions;
