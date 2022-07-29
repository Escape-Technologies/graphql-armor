import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, GraphQLError, ValidationContext, ASTVisitor, FieldNode } from 'graphql';
import { PluginConfig } from 'types';

export type FieldSuggestionConfig = {
  FieldSuggestion?: {} & PluginConfig;
};
export const DefaultFieldSuggestionConfig = {
  _namespace: 'FieldSuggestion',
  enabled: true,
};

const rule = ({}: PluginConfig): ValidationRule => {
  return function FieldSuggestion(ctx: ValidationContext): ASTVisitor {
    return {
      Field(node: FieldNode) {
        const type = ctx.getParentType();
        if (type) {
          const fieldName = node.name.value;
          const fieldDef = ctx.getFieldDef();
          if (!fieldDef) {
            throw new GraphQLError(`Field not found ${fieldName}`, {
              nodes: [node],
            });
          }
        }
      },
    };
  };
};

export class FieldSuggestion extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    return [rule(this.getConfig())];
  }
}
