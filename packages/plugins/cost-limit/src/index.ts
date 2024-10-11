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

export type CostLimitOptions = {
  maxCost?: number;
  objectCost?: number;
  scalarCost?: number;
  depthCostFactor?: number;
  ignoreIntrospection?: boolean;
  fragmentRecursionCost?: number;
  exposeLimits?: boolean;
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

const costLimitDefaultOptions: Required<CostLimitOptions> = {
  maxCost: 5000,
  objectCost: 2,
  scalarCost: 1,
  depthCostFactor: 1.5,
  fragmentRecursionCost: 1000,
  ignoreIntrospection: true,
  exposeLimits: false,
  errorMessage: 'Query validation error.',
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class CostLimitVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<CostLimitOptions>;
  private readonly visitedFragments: Map<string, number>;

  constructor(context: ValidationContext, options?: CostLimitOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      costLimitDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.visitedFragments = new Map();

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter.bind(this),
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const complexity = this.computeComplexity(operation);
    if (complexity > this.config.maxCost) {
      const message = this.config.exposeLimits
        ? `Query Cost limit of ${this.config.maxCost} exceeded, found ${complexity}.`
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
        handler(this.context, { n: complexity });
      }
    }
  }

  private computeComplexity(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
    depth = 0,
  ): number {
    if (this.config.ignoreIntrospection && 'name' in node && node.name?.value === '__schema') {
      return 0;
    }

    if (node.kind === Kind.OPERATION_DEFINITION) {
      return node.selectionSet.selections.reduce((v, child) => v + this.computeComplexity(child, depth + 1), 0);
    }

    let cost = this.config.scalarCost;
    if ('selectionSet' in node && node.selectionSet) {
      cost = this.config.objectCost;
      for (const child of node.selectionSet.selections) {
        cost += this.config.depthCostFactor * this.computeComplexity(child, depth + 1);
      }
    }

    if (node.kind === Kind.FRAGMENT_SPREAD) {
      if (this.visitedFragments.has(node.name.value)) {
        const visitCost = this.visitedFragments.get(node.name.value) ?? 0;
        return cost + this.config.depthCostFactor * visitCost;
      } else {
        this.visitedFragments.set(node.name.value, -1);
      }
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        const additionalCost = this.computeComplexity(fragment, depth + 1);
        if (this.visitedFragments.get(node.name.value) === -1) {
          this.visitedFragments.set(node.name.value, additionalCost);
        }
        cost += this.config.depthCostFactor * additionalCost;
      }
    }

    return cost;
  }
}

export const costLimitRule = (options?: CostLimitOptions) => (context: ValidationContext) =>
  new CostLimitVisitor(context, options);

export const costLimitPlugin = (options?: CostLimitOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(costLimitRule(options));
    },
  };
};
