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

type MaxDirectivesOptions = { n?: number };
const maxDirectivesDefaultOptions: MaxDirectivesOptions = {
  n: 50,
};

class MaxDirectivesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: MaxDirectivesOptions;
  private readonly onError: (msg: string) => any;

  constructor(context: ValidationContext, onError: (msg: string) => any, options?: MaxDirectivesOptions) {
    this.context = context;
    this.options = Object.assign(
      {},
      maxDirectivesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const directives = this.countDirectives(operation);
    if (directives > this.options.n!) {
      this.onError('Too many directives.');
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
    }
    if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        directives += this.countDirectives(fragment);
      }
    }
    return directives;
  }
}

const maxDirectivesRule =
  (onError: (msg: string) => any, options?: MaxDirectivesOptions) => (context: ValidationContext) =>
    new MaxDirectivesVisitor(context, onError, options);

const maxDirectivesPlugin = (options?: MaxDirectivesOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxDirectivesRule((msg: string) => {
          throw new GraphQLError(msg);
        }, options),
      );
    },
  };
};

export { maxDirectivesRule, MaxDirectivesOptions, maxDirectivesPlugin };
