import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule } from '../types';


import {ASTVisitor, GraphQLError, TypeInfo, visit, visitWithTypeInfo} from 'graphql';
import ComplexityVisitor from "../../lib/graphql-validation-complexity";

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
            visit(node, visitWithTypeInfo(typeInfo, visitor as ASTVisitor));
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
