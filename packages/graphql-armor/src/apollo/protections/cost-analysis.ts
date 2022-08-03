import { ApolloError} from 'apollo-server-core';
import { ValidationContext } from 'graphql';

import { ApolloServerConfigurationEnhancement, ApolloProtection } from './base-protection';

import QueryComplexity2 from "../../lib/graphql-query-complexity/QueryComplexity2";

const validationRule =
    (options: CostAnalysisOptions) =>
        (context: ValidationContext) =>   new QueryComplexity2(
            context,
            options,
            (message:string) => {  throw new ApolloError(message,"BAD_USER_INPUT");  }
        );

export class ApolloCostAnalysisProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // TODO: change
      return true;
      // default
    //if (!this.config.costAnalysis) return true;
    //return this.config.costAnalysis.enabled;
  }

  get options(): CostAnalysisOptions {
    return {
      maxCost: this.config.costAnalysis?.options?.maxCost || 5000,
      maxDepth: this.config.costAnalysis?.options?.maxDepth || 6,
      maxAlias: this.config.costAnalysis?.options?.maxAlias || 15,
      maxDirectives: this.config.costAnalysis?.options?.maxDirectives || 50,

        // TODO : what would be the best default values ?
        // best idea would be to run a benchmark on some API and compare with real measured time
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
