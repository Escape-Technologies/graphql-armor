import { Config as ApolloServerConfig } from 'apollo-server-core';
import { GraphQLError, ValidationContext, ASTVisitor, FieldNode } from 'graphql';
import { Protection } from 'plugins';

const validationRule = (context: ValidationContext): ASTVisitor => {
  return {
    Field(node: FieldNode) {
      const type = context.getParentType();
      if (type) {
        const fieldName = node.name.value;
        const fieldDef = context.getFieldDef();
        if (!fieldDef) {
          context.reportError(
            new GraphQLError(`Field not found ${fieldName}`, {
              nodes: [node],
            }),
          );
        }
      }
    },
  };
};

export type BlockFieldSuggestionOptions = undefined;
export class BlockFieldSuggestionProtection extends Protection {
  get isEnabled(): boolean {
    // default
    if (!this.config.blockFieldSuggestion) return true;
    return this.config.blockFieldSuggestion.enabled;
  }

  protect(apolloConfig: ApolloServerConfig): ApolloServerConfig {
    return this.applyValidationRules(apolloConfig, [validationRule]);
  }
}
