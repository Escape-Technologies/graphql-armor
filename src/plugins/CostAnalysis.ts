import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';

import { ComplexityVisitor } from 'graphql-validation-complexity';

import { GraphQLError, TypeInfo, visit, visitWithTypeInfo } from 'graphql';

export type CostAnalysisConfig = {
  CostAnalysis?: { options: { maxCost: number } } & PluginConfig;
};
export const DefaultCostAnalysisConfig = {
  _namespace: 'CostAnalysis',
  enabled: true,
  options: {
    maxCost: 1000,
  },
};

const rule = ({ options: { maxCost } }: PluginConfig): ValidationRule => {
  return function ComplexityLimit(context) {
    const visitor = new ComplexityVisitor(context, {});
    // @ts-ignore
    const typeInfo = context._typeInfo || new TypeInfo(context.getSchema());

    return {
      Document: {
        enter(node) {
          visit(node, visitWithTypeInfo(typeInfo, visitor));
        },
        leave(node) {
          const cost = visitor.getCost();
          if (cost > maxCost) {
            context.reportError(
              new GraphQLError('Query complexity limit exceeded', {
                nodes: [node],
              })
            );
          }
        },
      },
    };
  };
};

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    return [rule(this.getConfig())];
  }
}
