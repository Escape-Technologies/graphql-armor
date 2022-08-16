import type { Plugin } from '@envelop/core';
import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLError,
  InlineFragmentNode,
  Kind,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';

type MaxDepthOptions = { n?: number };
const maxDepthDefaultOptions: MaxDepthOptions = {
  n: 6,
};

class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: MaxDepthOptions;
  private onError: (msg: string) => any;

  constructor(
    context: ValidationContext,
    onError: (msg: string) => any,
    options: MaxDepthOptions = maxDepthDefaultOptions,
  ) {
    this.context = context;
    this.options = Object.assign(
      {},
      maxDepthDefaultOptions,
      ...Object.entries(options).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const depth = this.countDepth(operation);
    if (depth > this.options.n!) {
      this.onError('Query is too deep.');
    }
  }

  private countDepth(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    depth: number = 0,
  ): number {
    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        depth = Math.max(depth, this.countDepth(child, depth + 1));
      }
    }
    if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        depth = Math.max(depth, this.countDepth(fragment, depth + 1));
      }
    }
    return depth;
  }
}

const maxDepthRule = (onError: (msg: string) => any, options?: MaxDepthOptions) => (context: ValidationContext) =>
  new MaxDepthVisitor(context, onError, options);

const maxDepthPlugin = (options?: MaxDepthOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxDepthRule((msg: string) => {
          throw new GraphQLError(msg);
        }, options),
      );
    },
  };
};

export { maxDepthRule, MaxDepthOptions, maxDepthPlugin };
