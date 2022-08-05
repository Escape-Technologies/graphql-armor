import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

import { CostAnalysisOptions, costAnalysisOptionsDefaults } from '../../config';
import { costAnalysisRule } from '../../internals/cost-analysis';
import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

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
      ...costAnalysisOptionsDefaults,
      ...this.config.costAnalysis,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
