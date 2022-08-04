import {
  FieldNode,
  FragmentDefinitionNode,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import { MaxDepthOptions } from '../config';

class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: MaxDepthOptions;
  private onError: (string) => any;

  constructor(context: ValidationContext, options: MaxDepthOptions, onError: (string) => any) {
    this.context = context;
    this.options = options;
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const depth = this.countDepth(operation);
    if (depth > this.options.n) {
      this.onError('Request too deep.');
    }
  }

  private countDepth(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode,
    depth: number = 0,
  ): number {
    // @ts-ignore
    let newDepth = depth;
    if (node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        // @ts-ignore
        newDepth = Math.max(newDepth, this.countDepth(child, depth + 1));
      }
    }
    return newDepth;
  }
}

export const maxDepthRule = (options: MaxDepthOptions, onError: (string) => any) => (context: ValidationContext) =>
  new MaxDepthVisitor(context, options, onError);
