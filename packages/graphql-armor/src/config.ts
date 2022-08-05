import { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import { CharacterLimitOptions } from '@escape.tech/graphql-armor-character-limit';
import { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';

export type ProtectionConfiguration = {
  enabled: boolean;
};

export type CostAnalysisOptions = {
  maxCost: number;
  objectCost: number;
  scalarCost: number;
  depthCostFactor: number;
  ignoreIntrospection: boolean;
};

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration&BlockFieldSuggestionsOptions;
  characterLimit?: ProtectionConfiguration&CharacterLimitOptions;
  costAnalysis?: ProtectionConfiguration&CostAnalysisOptions;
  maxAliases?: ProtectionConfiguration&MaxAliasesOptions;
  maxDepth?: ProtectionConfiguration&MaxDepthOptions;
  maxDirectives?: ProtectionConfiguration&MaxDirectivesOptions;

};
