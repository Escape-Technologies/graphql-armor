import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';
import { ASTVisitor, GraphQLError, TypeInfo, visit, visitWithTypeInfo } from 'graphql';
import ComplexityVisitor from '../../lib/graphql-validation-complexity';

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

const rule = ({ options: { maxCost } }: PluginConfig): ValidationRule =>
  function ComplexityLimit(context) {
    const visitor = new ComplexityVisitor(context, {});
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
          if (cost > maxCost) {
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

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    return [rule(this.getConfig())];
  }
}
