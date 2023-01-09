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

export type CostLimitOptions = {
  maxCost?: number;
  objectCost?: number;
  scalarCost?: number;
  depthCostFactor?: number;
  ignoreIntrospection?: boolean;
} & GraphQLArmorCallbackConfiguration;
const costLimitDefaultOptions: Required<CostLimitOptions> = {
  maxCost: 5000,
  objectCost: 2,
  scalarCost: 1,
  depthCostFactor: 1.5,
  ignoreIntrospection: true,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

class CostLimitVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<CostLimitOptions>;

  constructor(context: ValidationContext, options?: CostLimitOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      costLimitDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const complexity = this.computeComplexity(operation);
    if (complexity > this.config.maxCost) {
      const err = new GraphQLError(
        `Syntax Error: Query Cost limit of ${this.config.maxCost} exceeded, found ${complexity}.`,
      );

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
    depth: number = 0,
  ): number {
    if (this.config.ignoreIntrospection && 'name' in node && node.name?.value === '__schema') {
      return 0;
    }

    // const typeDefs: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType = this.context
    // .getSchema()
    // .getQueryType();
    let cost = this.config.scalarCost;
    if ('selectionSet' in node && node.selectionSet) {
      cost = this.config.objectCost;
      for (let child of node.selectionSet.selections) {
        cost += this.config.depthCostFactor * this.computeComplexity(child, depth + 1);
      }
    }

    if (node.kind == Kind.FRAGMENT_SPREAD) {
      const fragment = this.context.getFragment(node.name.value);
      if (fragment) {
        cost += this.config.depthCostFactor * this.computeComplexity(fragment, depth + 1);
      }
    }

    return cost;
  }
}

export const costLimitRule = (options?: CostLimitOptions) => (context: ValidationContext) =>
  new CostLimitVisitor(context, options);

export function costLimitPlugin<PluginContext extends Record<string, unknown> = {}>(
  options?: CostLimitOptions & GraphQLArmorValidateConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;
  return {
    onValidate({ addValidationRule, context, params }) {
      if (!enabled({ context, params })) return;
      addValidationRule(costLimitRule(options));
    },
  };
}
