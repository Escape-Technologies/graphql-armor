import { ArmorPlugin } from '../ArmorPlugin';
import { PluginConfig } from '../types';
import { ValidationContext } from 'graphql';

import { GraphQLError } from 'graphql';
import QueryComplexity, {
  ComplexityEstimator,
  ComplexityEstimatorArgs,
} from '../../lib/graphql-query-complexity/QueryComplexity';

export type CostAnalysisConfig = {
  CostAnalysis?: {
    options: {
      maxCost: number;
      maxDepth: number;
      maxAlias: number;
    };
  } & PluginConfig;
};
export const DefaultCostAnalysisConfig = {
  _namespace: 'CostAnalysis',
  enabled: true,
  options: {
    maxCost: 5000,
    defaultComplexity: 1,
    maxDepth: 6,
    maxAlias: 15,
    maxDirectives: 50,
  },
};

function simpleEstimator(options?: { defaultComplexity?: number }): ComplexityEstimator {
  const defaultComplexity = options && typeof options.defaultComplexity === 'number' ? options.defaultComplexity : 1;
  return (args: ComplexityEstimatorArgs): number | void => {
    return defaultComplexity + args.childComplexity;
  };
}

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): Array<(context: ValidationContext) => any> {
    const config: PluginConfig = this.getConfig() as PluginConfig;

    const rule = (context: ValidationContext): QueryComplexity => {
      return new QueryComplexity(context, {
        maxDepth: config.options.maxDepth,
        maximumComplexity: config.options.maxCost,
        maxAlias: config.options.maxAlias,
        maxDirectives: config.options.maxDirectives,

        variables: {},
        onComplete: (_complexity: number) => {},
        createError: (max: number, actual: number) => {
          return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
        },
        estimators: [
          simpleEstimator({
            defaultComplexity: config.options.defaultComplexity,
          }),
        ],
      });
    };

    return [rule];
  }
}
