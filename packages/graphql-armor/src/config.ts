import { MaxAliasOptions } from '@escape.tech/graphql-armor-max-aliases';
import { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';

import { ProtectionConfiguration } from './apollo/protections/base-protection';

export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type CostAnalysisOptions = {
  maxCost: number;
  objectCost: number;
  scalarCost: number;
  depthCostFactor: number;
  ignoreIntrospection: boolean;
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
