import { ApolloError } from 'apollo-server-core';
import type { ValidationContext } from 'graphql';

import { ApolloServerConfigurationEnhancement, ApolloProtection } from './base-protection';

import QueryComplexity, {
  ComplexityEstimator,
  ComplexityEstimatorArgs,
} from '../../../lib/graphql-query-complexity/QueryComplexity';
import { CostAnalysisOptions } from '../../config';

function simpleEstimator(options?: { defaultComplexity?: number }): ComplexityEstimator {
  const defaultComplexity = options && typeof options.defaultComplexity === 'number' ? options.defaultComplexity : 1;
  return (args: ComplexityEstimatorArgs): number | void => {
    return defaultComplexity + args.childComplexity;
  };
}

const validationRule =
  (options: CostAnalysisOptions) =>
  (context: ValidationContext): QueryComplexity =>
    new QueryComplexity(
      context,
      {
        maxDepth: options.maxDepth,
        maximumComplexity: options.maxCost,
        maxAlias: options.maxAlias,
        maxDirectives: options.maxDirectives,

        variables: {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onComplete: () => {},
        createError: () => {
          // this.log(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
          // we don't want people to know how complexity is computed
          // return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
          return new ApolloError(`Query is too complex.`, 'BAD_USER_INPUT');
        },
        estimators: [
          simpleEstimator({
            defaultComplexity: options.defaultComplexity,
          }),
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      // (message) => this.log(message),
    );

export class ApolloCostAnalysisProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.costAnalysis) return true;
    return this.config.costAnalysis.enabled;
  }

  get options(): CostAnalysisOptions {
    return {
      maxCost: this.config.costAnalysis?.options?.maxCost || 5000,
      defaultComplexity: this.config.costAnalysis?.options?.defaultComplexity || 1,
      maxDepth: this.config.costAnalysis?.options?.maxDepth || 6,
      maxAlias: this.config.costAnalysis?.options?.maxAlias || 15,
      maxDirectives: this.config.costAnalysis?.options?.maxDirectives || 50,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [validationRule(this.options)],
    };
  }
}
