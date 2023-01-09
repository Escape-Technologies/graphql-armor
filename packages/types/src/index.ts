import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';
import type { MaxTokensOptions } from '@escape.tech/graphql-armor-max-tokens';
import type { GraphQLError, ValidationContext } from 'graphql';

export type ProtectionConfiguration = {
  enabled?: boolean;
};

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration & BlockFieldSuggestionsOptions;
  costLimit?: ProtectionConfiguration & CostLimitOptions;
  maxAliases?: ProtectionConfiguration & MaxAliasesOptions;
  maxDepth?: ProtectionConfiguration & MaxDepthOptions;
  maxDirectives?: ProtectionConfiguration & MaxDirectivesOptions;
  maxTokens?: ProtectionConfiguration & MaxTokensOptions;
};

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;
export type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;
export type GraphQLArmorCallbackConfiguration = {
  onAccept?: GraphQLArmorAcceptCallback[];
  onReject?: GraphQLArmorRejectCallback[];
  propagateOnRejection?: boolean;
};
