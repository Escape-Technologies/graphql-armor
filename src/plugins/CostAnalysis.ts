import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';

import { ComplexityVisitor } from 'graphql-validation-complexity';

import { GraphQLError, TypeInfo, visit, visitWithTypeInfo } from 'graphql';

export type CostAnalysisConfig = {
  CostAnalysis?: { options: { maxCost: number } } & PluginConfig;
};
export const DefaultCostAnalysisConfig = {
  namespace: 'CostAnalysis',
  enabled: true,
  options: {
    maxCost: 1000,
  },
};

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    const maxCost = 60000;
    const options = {};

    const complexityLimitRule: ValidationRule = function ComplexityLimit(
      context
    ) {
      const visitor = new ComplexityVisitor(context, options);
      // @ts-ignore
      const typeInfo = context._typeInfo || new TypeInfo(context.getSchema());

      return {
        Document: {
          enter(node) {
            visit(node, visitWithTypeInfo(typeInfo, visitor));
          },
          leave(node) {
            const cost = visitor.getCost();
            console.log(`COST: ${cost}`);
            if (cost > maxCost) {
              context.reportError(
                new GraphQLError('query exceeds complexity limit', {
                  nodes: [node],
                })
              );
            }
          },
        },
      };
    };

    return [complexityLimitRule];
  }
}
