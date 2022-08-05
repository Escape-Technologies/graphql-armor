import type { Plugin } from '@envelop/core';
import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLError,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';

type MaxDepthOptions = { n: number };
class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: MaxDepthOptions;
  private onError: (msg: string) => any;

  constructor(context: ValidationContext, options: MaxDepthOptions, onError: (msg: string) => any) {
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
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    depth: number = 0,
  ): number {
    let newDepth = depth;
    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        newDepth = Math.max(newDepth, this.countDepth(child, depth + 1));
      }
    }
    return newDepth;
  }
}

const maxDepthRule = (options: MaxDepthOptions, onError: (msg: string) => any) => (context: ValidationContext) =>
  new MaxDepthVisitor(context, options, onError);

const maxDepthPlugin = (options: MaxDepthOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxDepthRule(options, (msg: string) => {
          throw new GraphQLError(msg);
        }),
      );
    },
  };
};

export { maxDepthRule, MaxDepthOptions, maxDepthPlugin };
