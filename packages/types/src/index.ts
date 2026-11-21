import type { BaseContext, GraphQLRequestContext } from '@apollo/server';
import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';
import type { MaxTokensOptions } from '@escape.tech/graphql-armor-max-tokens';
import type { GraphQLError, ValidationContext } from 'graphql';

// Core configuration types
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

// Context and validation types
export interface EnhancedValidationContext extends ValidationContext {
  graphqlRequest?: GraphQLRequestContext<BaseContext>;
}

// User and authentication types
export interface User {
  id?: string;
  trustLevel?: string;
  [key: string]: unknown;
}

// Callback types
export interface AcceptCallbackDetails {
  [key: string]: unknown;
}

export type GraphQLArmorAcceptCallback = (
  ctx: EnhancedValidationContext | null,
  details: AcceptCallbackDetails,
) => void;

export type GraphQLArmorRejectCallback = (ctx: EnhancedValidationContext | null, error: GraphQLError) => void;

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

// Type guards
export const isEnhancedValidationContext = (context: ValidationContext | null): context is EnhancedValidationContext =>
  context !== null && 'graphqlRequest' in context;

export const isUser = (value: unknown): value is User =>
  typeof value === 'object' && value !== null && 'trustLevel' in value;

// Utility functions
export const createRejectionError = (message: string, user?: User): Error => {
  const userInfo = user?.id ? ` for user ${user.id}` : '';
  return new Error(`${message}${userInfo}`);
};

export const validateRequestContext = (context: EnhancedValidationContext): void => {
  if (!context.graphqlRequest) {
    throw new Error('Request context not available');
  }
};
