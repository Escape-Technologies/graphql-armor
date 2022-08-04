/*
Greatly inspired from
https://github.com/slicknode/graphql-query-complexity
2022/08/01 (yyyy/mm/dd)
under MIT License

(but fully rewritten)
*/

import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import { CostAnalysisOptions } from '../config';

export default class CostAnalysisVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: CostAnalysisOptions;
  private readonly onError: any;

  constructor(context: ValidationContext, options: CostAnalysisOptions, onError: (string: any) => any) {
    this.context = context;
    this.options = options;
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const complexity = this.computeComplexity(operation);
    if (complexity > this.options.maxCost) {
      this.onError('Query is too complex.'); // TODO : des détails ?
    }
  }

  private computeComplexity(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode,
    depth: number = 0,
  ): number {
    // @ts-ignore
    const typeDefs: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType = this.context
      .getSchema()
      .getQueryType();
    let cost = this.options.scalarCost;
    if (node.selectionSet) {
      cost = this.options.objectCost;
      for (let child of node.selectionSet.selections) {
        //@ts-ignore
        cost += this.options.depthCostFactor * this.computeComplexity(child, depth + 1);
      }
    }
    return cost;
  }
}
