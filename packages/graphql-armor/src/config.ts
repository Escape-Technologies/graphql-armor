import { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';

export type ProtectionConfiguration = {
  enabled: boolean;
};

export type BlockFieldSuggestionOptions = {};

export type CharacterLimitOptions = { maxLength: number };

export type CostAnalysisOptions = {
  maxCost: number;
  objectCost: number;
  scalarCost: number;
  depthCostFactor: number;
  ignoreIntrospection: boolean;
};

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration&BlockFieldSuggestionOptions;
  characterLimit?: ProtectionConfiguration&CharacterLimitOptions;
  costAnalysis?: ProtectionConfiguration&CostAnalysisOptions;
  maxAliases?: ProtectionConfiguration&MaxAliasesOptions;
  maxDepth?: ProtectionConfiguration&MaxDepthOptions;
  maxDirectives?: ProtectionConfiguration&MaxDirectivesOptions;
};
