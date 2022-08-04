import { ApolloError } from 'apollo-server-core';
import { ValidationContext } from 'graphql';
import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';
import { CostAnalysisOptions } from '../../config';
import CostAnalysisVisitor from '../../validationRules/cost-analysis';

const validationRule = (options: CostAnalysisOptions) => (context: ValidationContext) =>
  new CostAnalysisVisitor(context, options, (message: string) => {
    throw new ApolloError(message, 'BAD_USER_INPUT');
  });

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
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [validationRule(this.options)],
    };
  }
}
