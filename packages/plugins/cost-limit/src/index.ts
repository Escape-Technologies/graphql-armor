import type { Plugin } from '@envelop/core';
import type {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import { GraphQLError, Kind } from 'graphql';

type CostLimitOptions = {
  maxCost?: number;
  objectCost?: number;
  scalarCost?: number;
  depthCostFactor?: number;
  ignoreIntrospection?: boolean;
};
const costLimitDefaultOptions: Required<CostLimitOptions> = {
  maxCost: 5000,
  objectCost: 2,
  scalarCost: 1,
  depthCostFactor: 1.5,
  ignoreIntrospection: true,
};

class CostLimitVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly config: Required<CostLimitOptions>;
  private readonly onError: any;

  constructor(context: ValidationContext, onError: (string: any) => any, options?: CostLimitOptions) {
    this.context = context;
    this.config = Object.assign(
      {},
      costLimitDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const complexity = this.computeComplexity(operation);
    if (complexity > this.config.maxCost) {
      this.onError(`Query is too expensive.`);
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

const costLimitRule =
  (errorHandler: (msg: string) => void, options?: CostLimitOptions) => (context: ValidationContext) =>
    new CostLimitVisitor(context, errorHandler, options);

const costLimitPlugin = (options?: CostLimitOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        costLimitRule((msg: string) => {
          throw new GraphQLError(msg);
        }, options),
      );
    },
  };
};

export { costLimitRule, CostLimitOptions, costLimitPlugin };
