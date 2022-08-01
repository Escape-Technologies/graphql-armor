import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, GraphQLError, ValidationContext, ASTVisitor, FieldNode } from 'graphql';
import { PluginConfig } from 'types';

export type BlockFieldSuggestionConfig = {
  BlockFieldSuggestion?: {} & PluginConfig;
};
export const DefaultBlockFieldSuggestionConfig = {
  _namespace: 'BlockFieldSuggestion',
  enabled: true,
};

const rule = ({}: PluginConfig): ValidationRule => {
  return function BlockFieldSuggestion(ctx: ValidationContext): ASTVisitor {
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

export class BlockFieldSuggestion extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    return [rule(this.getConfig())];
  }
}
