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
