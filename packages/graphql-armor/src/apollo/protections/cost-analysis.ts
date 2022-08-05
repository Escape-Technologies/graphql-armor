import { GraphQLError } from 'graphql';

import { CostAnalysisOptions } from '../../config';
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
      maxCost: this.config.costAnalysis?.maxCost || 5000,
      objectCost: this.config.costAnalysis?.objectCost || 2,
      scalarCost: this.config.costAnalysis?.scalarCost || 1,
      depthCostFactor: this.config.costAnalysis?.depthCostFactor || 1.5,
      ignoreIntrospection: this.config.costAnalysis?.ignoreIntrospection ?? true,
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
