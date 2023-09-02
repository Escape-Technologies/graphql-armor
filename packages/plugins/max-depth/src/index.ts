import type { Plugin } from '@envelop/core';
import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
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

export type MaxDepthOptions = {
  n?: number;
  ignoreIntrospection?: boolean;
  flattenFragments?: boolean;
} & GraphQLArmorCallbackConfiguration;
const maxDepthDefaultOptions: Required<MaxDepthOptions> = {
  n: 6,
  ignoreIntrospection: true,
  flattenFragments: false,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxDepthOptions>;
  private readonly visitedFragments: Map<string, number>;

  constructor(context: ValidationContext, options?: MaxDepthOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxDepthDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.visitedFragments = new Map();

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const depth = this.countDepth(operation);
    if (depth > this.config.n) {
      const err = new GraphQLError(`Syntax Error: Query depth limit of ${this.config.n} exceeded, found ${depth}.`);

      for (const handler of this.config.onReject) {
        handler(this.context, err);
      }

      if (this.config.propagateOnRejection) {
        throw err;
      }
    } else {
      for (const handler of this.config.onAccept) {
        handler(this.context, { n: depth });
      }
    }
  }

  private countDepth(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    parentDepth = 0,
  ): number {
    if (this.config.ignoreIntrospection && 'name' in node && node.name?.value === '__schema') {
      return 0;
    }
    let depth = parentDepth;

    if ('selectionSet' in node && node.selectionSet) {
      for (const child of node.selectionSet.selections) {
        if (
          this.config.flattenFragments &&
          (child.kind === Kind.INLINE_FRAGMENT || child.kind === Kind.FRAGMENT_SPREAD)
        ) {
          depth = Math.max(depth, this.countDepth(child, parentDepth));
        } else {
          depth = Math.max(depth, this.countDepth(child, parentDepth + 1));
        }
      }
    } else if (node.kind == Kind.FRAGMENT_SPREAD) {
      if (this.visitedFragments.has(node.name.value)) {
        return this.visitedFragments.get(node.name.value) ?? 0;
      } else {
        this.visitedFragments.set(node.name.value, -1);
      }
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        let fragmentDepth;
        if (this.config.flattenFragments) {
          fragmentDepth = this.countDepth(fragment, parentDepth);
        } else {
          fragmentDepth = this.countDepth(fragment, parentDepth + 1);
        }
        depth = Math.max(depth, fragmentDepth);
        if (this.visitedFragments.get(node.name.value) === -1) {
          this.visitedFragments.set(node.name.value, fragmentDepth);
        }
      }
    }
    return depth;
  }
}

export const maxDepthRule = (options?: MaxDepthOptions) => (context: ValidationContext) =>
  new MaxDepthVisitor(context, options);

export const maxDepthPlugin = (options?: MaxDepthOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(maxDepthRule(options));
    },
  };
};
