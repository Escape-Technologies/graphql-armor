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

type MaxAliasesOptions = {
  n?: number;
  allowList?: string[];
  exposeLimits?: boolean;
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

const maxAliasesDefaultOptions: Required<MaxAliasesOptions> = {
  n: 15,
  allowList: [],
  exposeLimits: false,
  errorMessage: 'Query validation error.',
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxAliasesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxAliasesOptions>;
  private readonly visitedFragments: Map<string, number>;

  constructor(context: ValidationContext, options?: MaxAliasesOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxAliasesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.visitedFragments = new Map();

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter.bind(this),
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const aliases = this.countAliases(operation);
    if (aliases > this.config.n) {
      const message = this.config.exposeLimits
        ? `Aliases limit of ${this.config.n} exceeded, found ${aliases}.`
        : this.config.errorMessage;
      const err = new GraphQLError(`Syntax Error: ${message}`);

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
    if (
      'alias' in node &&
      node.alias &&
      node.name.value !== '__typename' &&
      !this.config.allowList.includes(node.alias.value)
    ) {
      ++aliases;
    }
    if ('selectionSet' in node && node.selectionSet) {
      for (const child of node.selectionSet.selections) {
        aliases += this.countAliases(child);
      }
    } else if (node.kind === Kind.FRAGMENT_SPREAD) {
      if (this.visitedFragments.has(node.name.value)) {
        return this.visitedFragments.get(node.name.value) ?? 0;
      } else {
        this.visitedFragments.set(node.name.value, -1);
      }
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        const additionalAliases = this.countAliases(fragment);
        if (this.visitedFragments.get(node.name.value) === -1) {
          this.visitedFragments.set(node.name.value, additionalAliases);
        }
        aliases += additionalAliases;
      }
    }
    return aliases;
  }
}

const maxAliasesRule = (options?: MaxAliasesOptions) => (context: ValidationContext) =>
  new MaxAliasesVisitor(context, options);

const maxAliasesPlugin = (options?: MaxAliasesOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(maxAliasesRule(options));
    },
  };
};

export { maxAliasesRule, maxAliasesPlugin, MaxAliasesOptions };