import type { Plugin } from '@envelop/core';
import type {
  GraphQLArmorCallbackConfiguration,
  GraphQLArmorValidateConfiguration,
} from '@escape.tech/graphql-armor-types';
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

export type MaxDepthOptions = { n?: number; ignoreIntrospection?: boolean } & GraphQLArmorCallbackConfiguration;
const maxDepthDefaultOptions: Required<MaxDepthOptions> = {
  n: 6,
  ignoreIntrospection: true,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxDepthVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxDepthOptions>;

  constructor(context: ValidationContext, options?: MaxDepthOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxDepthDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

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

export const maxDepthRule = (options?: MaxDepthOptions) => (context: ValidationContext) =>
  new MaxDepthVisitor(context, options);

export function maxDepthPlugin<PluginContext extends Record<string, unknown> = {}>(
  options?: MaxDepthOptions & GraphQLArmorValidateConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;
  return {
    onValidate({ addValidationRule, context, params }) {
      if (!enabled({ context, params })) return;
      addValidationRule(maxDepthRule(options));
    },
  };
}
