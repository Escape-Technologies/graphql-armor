import {
  ValidationContext,
  FieldNode,
  ASTVisitor,
  GraphQLError,
} from 'graphql';
import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';

export type IntrospectionConfig = { Introspection?: PluginConfig };
export const DefaultIntrospectionConfig = {
  namespace: 'Introspection',
  enabled: false,
};

// ToDo: Whitelist headers pairs -> Maybe use a apollo plugin instead?
function __plugin(context: ValidationContext): ASTVisitor {
  return {
    Field(node: FieldNode) {
      const blacklist = ['__schema', '__type'];
      if (blacklist.includes(node.name.value)) {
        context.reportError(new GraphQLError('Introspection is disabled'));
      }
    },
  };
}

export class Introspection extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    return [__plugin];
  }
}
