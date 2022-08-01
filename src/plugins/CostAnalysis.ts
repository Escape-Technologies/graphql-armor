import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';
import { ASTVisitor, GraphQLError, TypeInfo, visit, visitWithTypeInfo } from 'graphql';
import ComplexityVisitor from '../../lib/graphql-validation-complexity';

import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';

export type CostAnalysisConfig = {
  CostAnalysis?: { options: { maxCost: number } } & PluginConfig;
};
export const DefaultCostAnalysisConfig = {
  _namespace: 'CostAnalysis',
  enabled: true,
  options: {
    maxCost: 1000,
    scalarCost: 1,
    objectCost: 1,
    listFactor: 3,
    depthFactor: 1.5,
    // Special list factor to make schema queries not have huge costs.
    introspectionListFactor: 2,
  },
};

const rule = createComplexityRule({
  maximumComplexity: 10,
  variables: {},
  onComplete: (complexity: number) => {
    //console.log('Determined query complexity: ', complexity)
  },

  createError: (max: number, actual: number) => {
    const rule = ({ options }: PluginConfig): ValidationRule =>
      function ComplexityLimit(context) {
        const visitor = new ComplexityVisitor(context, options);
        // @ts-ignore
        const typeInfo = context._typeInfo || new TypeInfo(context.getSchema());

        return {
          Document: {
            enter(node) {
              visit(node, visitWithTypeInfo(typeInfo, visitor as ASTVisitor));
            },
            leave(node) {
              const cost = visitor.getCost();
              console.log(`COST: ${cost}`);
              if (cost > options.maxCost) {
                context.reportError(
                  new GraphQLError('query exceeds complexity limit', {
                    nodes: [node],
                  }),
                );
              }
            },
          },
        };
      };
    return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
  },
  estimators: [
    simpleEstimator({
      defaultComplexity: 1,
    }),
  ],
});

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    //return [rule(this.getConfig())];
    return [rule];
  }
}
