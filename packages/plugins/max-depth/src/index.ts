import type { Plugin } from '@envelop/core';
import type {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import { GraphQLError, Kind } from 'graphql'

type MaxDepthOptions = { n?: number; ignoreIntrospection?: boolean };
const maxDepthDefaultOptions: Required<MaxDepthOptions> = {
  n: 6,
  ignoreIntrospection: true,
};

class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxDepthOptions>;
  private onError: (msg: string) => any;

  constructor(context: ValidationContext, onError: (msg: string) => any, options?: MaxDepthOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxDepthDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const depth = this.countDepth(operation);
    if (depth > this.config.n) {
      this.onError('Query is too deep.');
    }
  }

  private countDepth(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    parentDepth: number = 0,
  ): number {
    if (this.config.ignoreIntrospection && 'name' in node && node.name?.value === '__schema') {
      return 0;
    }
    let depth = parentDepth;

    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        depth = Math.max(depth, this.countDepth(child, parentDepth + 1));
      }
    } else if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        depth = Math.max(depth, this.countDepth(fragment, parentDepth + 1));
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
