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
  onAccept?: GraphQLArmorAcceptCallback[];
  onReject?: GraphQLArmorRejectCallback[];
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
