import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';
import type { MaxTokensOptions } from '@escape.tech/graphql-armor-max-tokens';
import type { GraphQLError, ValidationContext } from 'graphql';

export type ProtectionConfiguration = {
  /**
   * Toggle the plugin.
   */
  enabled?: boolean;
};

export type GraphQLArmorConfig = {
  /**
   * Prevent returning field suggestions and leaking your schema to unauthorized actors.
   *
   * In production, this can lead to Schema leak even if the introspection is disabled.
   */
  blockFieldSuggestion?: ProtectionConfiguration & BlockFieldSuggestionsOptions;
  /**
   * Limit the complexity of a GraphQL document.
   */
  costLimit?: ProtectionConfiguration & CostLimitOptions;
  /**
   * Limit the number of aliases in a GraphQL document.
   *
   * It is used to prevent DOS attack or heap overflow.
   */
  maxAliases?: ProtectionConfiguration & MaxAliasesOptions;
  /**
   * Limit the depth of a GraphQL document.
   *
   * It is used to prevent too large queries that could lead to overfetching or DOS attack.
   */
  maxDepth?: ProtectionConfiguration & MaxDepthOptions;
  /**
   * Limit the number of directives in a GraphQL document.
   *
   * It is used to prevent DOS attack, heap overflow or server overloading.
   */
  maxDirectives?: ProtectionConfiguration & MaxDirectivesOptions;
  /**
   * Limit the number of tokens in a GraphQL document.
   *
   * It is used to prevent DOS attack, heap overflow or server overloading.
   *
   * The token limit is often limited by the graphql parser, but this is not always the case and would lead to a fatal heap overflow.
   */
  maxTokens?: ProtectionConfiguration & MaxTokensOptions;
};

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;
export type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;
export type GraphQLArmorCallbackConfiguration = {
  /**
   * Callbacks that are ran whenever a Query is accepted.
   */
  onAccept?: GraphQLArmorAcceptCallback[];
  /**
   * Callbacks that are ran whenever a Query is rejected.
   */
  onReject?: GraphQLArmorRejectCallback[];
  /**
   * Do you want to propagate the rejection to the client?
   * @default true
   */
  propagateOnRejection?: boolean;
};
