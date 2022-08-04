import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { CostAnalysisOptions } from '../../config';
import { GraphQLError } from 'graphql';
import { Plugin } from '@envelop/core';
import { costAnalysisRule } from '../../validationRules/cost-analysis';

const plugin = (options: CostAnalysisOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        costAnalysisRule(options, (msg: string) => {
          throw new GraphQLError(msg);
        }),
      );
    },
  };
};

export class EnvelopCostAnalysisProtection extends EnvelopProtection {
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

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
