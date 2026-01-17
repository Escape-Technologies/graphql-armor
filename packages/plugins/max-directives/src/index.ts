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

export type MaxDirectivesOptions = {
  /**
   * Directives threshold.
   * @default 50
   */
  n?: number;
  /**
   * If this is set to `true`, details about the configured limit are included in the GraphQLError message when errors occur.
   *
   * When set to `false` {@link MaxDirectivesOptions.errorMessage} is used as the GraphQLError message.
   * @default true
   */
  exposeLimits?: boolean;
  /**
   * The error message used when {@link MaxDirectivesOptions.exposeLimits} is set to `true`.
   * @default 'Query validation error.'
   */
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

export const maxDirectivesDefaultOptions: Required<MaxDirectivesOptions> = {
  n: 50,
  exposeLimits: true,
  errorMessage: 'Query validation error.',
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class MaxDirectivesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<MaxDirectivesOptions>;
  private readonly visitedFragments: Map<string, number>;

  constructor(context: ValidationContext, options?: MaxDirectivesOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      maxDirectivesDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.visitedFragments = new Map();

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter.bind(this),
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const directives = this.countDirectives(operation);
    if (directives > this.config.n) {
      const message = this.config.exposeLimits
        ? `Directives limit of ${this.config.n} exceeded, found ${directives}.`
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
      for (const child of node.selectionSet.selections) {
        directives += this.countDirectives(child);
      }
    } else if (node.kind === Kind.FRAGMENT_SPREAD) {
      if (this.visitedFragments.has(node.name.value)) {
        return this.visitedFragments.get(node.name.value) ?? 0;
      } else {
        this.visitedFragments.set(node.name.value, -1);
      }
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        const additionalDirectives = this.countDirectives(fragment);
        if (this.visitedFragments.get(node.name.value) === -1) {
          this.visitedFragments.set(node.name.value, additionalDirectives);
        }
        directives += additionalDirectives;
      }
    }
    return directives;
  }
}

/**
 * Limit the number of directives in a GraphQL document.
 *
 * It is used to prevent DOS attack, heap overflow or server overloading.
 *
 * Use with `@graphql/graphql-js`.
 */
export const maxDirectivesRule = (options?: MaxDirectivesOptions) => (context: ValidationContext) =>
  new MaxDirectivesVisitor(context, options);

/**
 * Limit the number of directives in a GraphQL document.
 *
 * It is used to prevent DOS attack, heap overflow or server overloading.
 *
 * Use with `@envelop/core` from `@the-guild-org`.
 */
export const maxDirectivesPlugin = <PluginContext extends Record<string, any> = {}>(
  options?: MaxDirectivesOptions,
): Plugin<PluginContext> => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(maxDirectivesRule(options));
    },
  };
};
