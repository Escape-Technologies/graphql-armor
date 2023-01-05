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

export type MaxDirectivesOptions = {
  n?: number;
} & GraphQLArmorCallbackConfiguration;
export const maxDirectivesDefaultOptions: Required<MaxDirectivesOptions> = {
  n: 50,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxDirectivesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxDirectivesOptions>;

  constructor(context: ValidationContext, options?: MaxDirectivesOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxDirectivesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const directives = this.countDirectives(operation);
    if (directives > this.config.n) {
      const err = new GraphQLError(`Syntax Error: Directives limit of ${this.config.n} exceeded, found ${directives}.`);

      for (const handler of this.config.onReject) {
        handler(this.context, err);
      }

      if (this.config.propagateOnRejection) {
        throw err;
      }
    } else {
      for (const handler of this.config.onAccept) {
        handler(this.context, { n: directives });
      }
    }
  }

  private countDirectives(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
  ): number {
    let directives = 0;
    if (node.directives) {
      directives += node.directives.length;
    }
    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        directives += this.countDirectives(child);
      }
    } else if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        directives += this.countDirectives(fragment);
      }
    }
    return directives;
  }
}

export const maxDirectivesRule = (options?: MaxDirectivesOptions) => (context: ValidationContext) =>
  new MaxDirectivesVisitor(context, options);

export function maxDirectivesPlugin<PluginContext extends Record<string, unknown> = {}>(
  options?: MaxDirectivesOptions & GraphQLArmorValidateConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;

  return {
    onValidate({ addValidationRule, context, params }) {
      if (!enabled({ context, params })) return;
      addValidationRule(maxDirectivesRule(options));
    },
  };
}
