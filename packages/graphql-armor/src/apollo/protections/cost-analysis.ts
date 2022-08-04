import { ApolloError } from 'apollo-server-core';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';
import { CostAnalysisOptions } from '../../config';
import { costAnalysisRule } from '../../validationRules/cost-analysis';

export class ApolloCostAnalysisProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.costAnalysis) return true;
    return this.config.costAnalysis.enabled;
  }

  get options(): CostAnalysisOptions {
    return {
      maxCost: this.config.costAnalysis?.options?.maxCost || 5000,
      objectCost: this.config.costAnalysis?.options?.objectCost || 2,
      scalarCost: this.config.costAnalysis?.options?.scalarCost || 1,
      depthCostFactor: this.config.costAnalysis?.options?.depthCostFactor || 1.5,
      ignoreIntrospection: this.config.costAnalysis?.options?.ignoreIntrospection ?? true,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        costAnalysisRule(this.options, (message: string) => {
          throw new ApolloError(message, 'BAD_USER_INPUT');
        }),
      ],
    };
  }
}
