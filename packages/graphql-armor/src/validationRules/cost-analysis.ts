import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  InlineFragmentNode,
  Kind,
  OperationDefinitionNode,
  SelectionSetNode,
  ValidationContext,
} from 'graphql';

import { CostAnalysisOptions } from '../config';

export const costAnalysisRule =
  (options: CostAnalysisOptions, errorHandler: (msg: string) => void) => (context: ValidationContext) =>
    new CostAnalysisVisitor(context, options, errorHandler);

class CostAnalysisVisitor {
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
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    depth: number = 0,
  ): number {
    if (this.options.ignoreIntrospection && 'name' in node && node.name?.value === '__schema') {
      return 0;
    }

    // const typeDefs: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType = this.context
    // .getSchema()
    // .getQueryType();
    let cost = this.options.scalarCost;
    if ('selectionSet' in node && node.selectionSet) {
      cost = this.options.objectCost;
      for (let child of node.selectionSet.selections) {
        cost += this.options.depthCostFactor * this.computeComplexity(child, depth + 1);
      }
    }

    if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value) as FragmentDefinitionNode;
      cost += this.options.depthCostFactor * this.computeComplexity(fragment, depth + 1);
    }

    return cost;
  }
}
