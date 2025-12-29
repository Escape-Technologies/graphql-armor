import type { ApolloServerPlugin, BaseContext, GraphQLRequestContext } from '@apollo/server';
import { isEnhancedValidationContext } from '@escape.tech/graphql-armor-types';
import type { ASTVisitor, ValidationRule as GraphQLValidationRule, ValidationContext } from 'graphql';

// Types
interface ExtendedValidationContext extends ValidationContext {
  graphqlRequest?: GraphQLRequestContext<BaseContext>;
  _rules?: ValidationRule[];
}

interface ValidationRule {
  attachRequestContext?: (requestContext: GraphQLRequestContext<BaseContext>) => void;
  [key: string]: unknown;
}

type RuleFunction = (context: ValidationContext) => ASTVisitor;

// Helper function to create a rule wrapper that injects the request context
export const injectRequestContextRule = (rule: RuleFunction): GraphQLValidationRule => {
  return (context: ValidationContext): ASTVisitor => {
    const visitor = rule(context);

    if (!isEnhancedValidationContext(context)) {
      return visitor;
    }

    // We need to cast here because ASTVisitor doesn't know about our custom property
    const enhancedVisitor = {
      ...visitor,
      attachRequestContext: (requestContext: GraphQLRequestContext<BaseContext>) => {
        (context as ExtendedValidationContext).graphqlRequest = requestContext;
      },
    };

    return enhancedVisitor as unknown as ASTVisitor;
  };
};

// Helper function to find validation context in different Apollo versions
const findValidationContext = (validationCtx: any): ValidationContext | undefined => {
  return validationCtx.validationContext || validationCtx.context?.document?.validationContext;
};

// Helper function to process validation rules
const processValidationRules = (
  validationContext: ExtendedValidationContext,
  requestContext: GraphQLRequestContext<BaseContext>,
): void => {
  const rules = validationContext._rules || [];
  const contextRules = rules.filter((rule): rule is ValidationRule =>
    Boolean(rule?.attachRequestContext && typeof rule.attachRequestContext === 'function'),
  );

  contextRules.forEach((rule) => rule.attachRequestContext?.(requestContext));
};

// Create a single shared plugin instance for context injection
export const contextInjectionPlugin: ApolloServerPlugin<BaseContext> = {
  async requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
    return {
      async validationDidStart(validationCtx: any) {
        const validationContext = findValidationContext(validationCtx);

        if (validationContext && isEnhancedValidationContext(validationContext)) {
          processValidationRules(validationContext as ExtendedValidationContext, requestContext);
        }
      },
    };
  },
};
