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

type MaxAliasesOptions = { n?: number };
const maxAliasesDefaultOptions: Required<MaxAliasesOptions> = {
  n: 15,
};

class MaxAliasesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxAliasesOptions>;
  private onError: (msg: string) => any;

  constructor(context: ValidationContext, onError: (msg: string) => any, options?: MaxAliasesOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxAliasesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

    this.onError = onError;
    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const aliases = this.countAliases(operation);
    if (aliases > this.config.n) {
      this.context.reportError(
        this.onError(`Syntax Error: Aliases limit of ${this.config.n} exceeded, found ${aliases}.`),
      );
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

const maxAliasesRule = (onError: (msg: string) => any, options?: MaxAliasesOptions) => (context: ValidationContext) =>
  new MaxAliasesVisitor(context, onError, options);

const maxAliasesPlugin = (options?: MaxAliasesOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxAliasesRule((msg: string) => {
          throw new GraphQLError(msg);
        }, options),
      );
    },
  };
};

export { maxAliasesRule, maxAliasesPlugin, MaxAliasesOptions };
