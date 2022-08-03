/*
Taken from
https://github.com/slicknode/graphql-query-complexity
2022/08/01 (yyyy/mm/dd)
under MIT License
*/

import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLError,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import {CostAnalysisOptions} from "../../src/plugins/protection-options";


export default class QueryComplexity2 {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: CostAnalysisOptions;
  private readonly onError: any;

  constructor(context: ValidationContext, options: CostAnalysisOptions, onError: (string) => any) {
    this.context = context;
    this.options = options;
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
      leave: this.onOperationDefinitionLeave
    }

  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const complexity = this.computeComplexity(operation);
    console.log(complexity);
    if (complexity > this.options.maxCost) {
      this.onError("Query is too complex."); // TODO : des détails ?
    }
  }

  onOperationDefinitionLeave(
      operation: OperationDefinitionNode
  ): GraphQLError | void {


  }

  private computeComplexity(node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode,
                            counters: { depth: number, alias: number, directives: number } = {
                              depth: 0,
                              alias: 0,
                              directives: 0
                            }): number {

    // @ts-ignore
    const typeDefs :GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType =  this.context.getSchema().getQueryType();
    if (counters.depth > this.options.maxDepth) {
      return +Infinity;
    }

    let cost = this.options.scalarCost;
    if(node.selectionSet) {
    cost = this.options.objectCost;

      for (let child of node.selectionSet.selections) {
        //@ts-ignore
        cost += this.options.depthCostFactor * this.computeComplexity(child, {...counters, depth: counters.depth + 1});
      }

    }


    return cost;
  }
}
