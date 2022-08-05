import { GraphQLError } from 'graphql';

import { CostAnalysisOptions, costAnalysisOptionsDefaults } from '../../config';
import { costAnalysisRule } from '../../internals/cost-analysis';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloCostAnalysisProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.costAnalysis) return true;
    return this.config.costAnalysis.enabled;
  }

  get options(): CostAnalysisOptions {
    return {
      ...costAnalysisOptionsDefaults,
      ...this.config.costAnalysis,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        costAnalysisRule(this.options, (message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }),
      ],
    };
  }
}
