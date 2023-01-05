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
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';

type MaxAliasesOptions = { n?: number } & GraphQLArmorCallbackConfiguration;
const maxAliasesDefaultOptions: Required<MaxAliasesOptions> = {
  n: 15,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxAliasesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxAliasesOptions>;

  constructor(context: ValidationContext, options?: MaxAliasesOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxAliasesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const aliases = this.countAliases(operation);
    if (aliases > this.config.n) {
      const err = new GraphQLError(`Syntax Error: Aliases limit of ${this.config.n} exceeded, found ${aliases}.`);

      for (const handler of this.config.onReject) {
        handler(this.context, err);
      }

      if (this.config.propagateOnRejection) {
        throw err;
      }
    } else {
      for (const handler of this.config.onAccept) {
        handler(this.context, { n: aliases });
      }
    }
  }

  private countAliases(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
  ): number {
    let aliases = 0;
    if ('alias' in node && node.alias) {
      ++aliases;
    }
    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        aliases += this.countAliases(child);
      }
    } else if (node.kind === 'FragmentSpread') {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        aliases += this.countAliases(fragment);
      }
    }
    return aliases;
  }
}

const maxAliasesRule = (options?: MaxAliasesOptions) => (context: ValidationContext) =>
  new MaxAliasesVisitor(context, options);

function maxAliasesPlugin<PluginContext extends Record<string, unknown> = {}>(
  options?: MaxAliasesOptions & GraphQLArmorValidateConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;
  return {
    onValidate({ addValidationRule, context, params }) {
      if (!enabled({ context, params })) return;
      addValidationRule(maxAliasesRule(options));
    },
  };
}

export { maxAliasesRule, maxAliasesPlugin, MaxAliasesOptions };
