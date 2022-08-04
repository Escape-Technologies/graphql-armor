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
    // @ts-ignore
    if (this.options.ignoreIntrospection && node.name && node.name.value === '__schema') {
      return 0;
    }

    // @ts-ignore
    const typeDefs: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType = this.context
      .getSchema()
      .getQueryType();
    let cost = this.options.scalarCost;
    // @ts-ignore
    if (node.selectionSet) {
      cost = this.options.objectCost;
      //@ts-ignore
      for (let child of node.selectionSet.selections) {
        //@ts-ignore
        cost += this.options.depthCostFactor * this.computeComplexity(child, depth + 1);
      }
    }

    if (node.kind == Kind.FRAGMENT_SPREAD) {
      //@ts-ignore
      const fragment = this.context.getFragment(node.name.value) as FragmentDefinitionNode;
      cost += this.options.depthCostFactor * this.computeComplexity(fragment, depth + 1);
    }

    return cost;
  }
}
