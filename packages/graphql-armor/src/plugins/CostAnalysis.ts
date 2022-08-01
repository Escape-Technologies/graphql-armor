import { ArmorPlugin } from '../ArmorPlugin';
import { ValidationRule, PluginConfig } from '../types';
import { GraphQLError } from 'graphql';
import { ValidationContext } from 'graphql';
import QueryComplexity, {
  ComplexityEstimator,
  ComplexityEstimatorArgs,
} from '../../lib/graphql-query-complexity/QueryComplexity';

export type CostAnalysisConfig = {
  CostAnalysis?: {
    options: {
      maxCost: number;
      maxDepth: number;
      maxFields: number;
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
    maxFields: 75,
  },
};

function simpleEstimator(options?: { defaultComplexity?: number }): ComplexityEstimator {
  const defaultComplexity = options && typeof options.defaultComplexity === 'number' ? options.defaultComplexity : 1;
  return (args: ComplexityEstimatorArgs): number | void => {
    return defaultComplexity + args.childComplexity;
  };
}

export class CostAnalysis extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    const config: PluginConfig = this.getConfig() as PluginConfig;

    const rule = (context: ValidationContext): QueryComplexity => {
      return new QueryComplexity(context, {
        maxDepth: config.options.maxDepth,
        maximumComplexity: config.options.maxCost,
        variables: {},
        onComplete: (complexity: number) => {
          console.log('Determined query complexity: ', complexity);
        },
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
