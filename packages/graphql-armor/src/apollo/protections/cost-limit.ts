import { CostLimitOptions, costLimitRule } from '@escape.tech/graphql-armor-cost-limit';
import { GraphQLError } from 'graphql';

import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';

export class ApolloCostLimitProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.costLimit) return true;
    return this.config.costLimit.enabled;
  }

  get options(): CostLimitOptions {
    return {
      maxCost: this.config.costLimit?.maxCost || 5000,
      objectCost: this.config.costLimit?.objectCost || 2,
      scalarCost: this.config.costLimit?.scalarCost || 1,
      depthCostFactor: this.config.costLimit?.depthCostFactor || 1.5,
      ignoreIntrospection: this.config.costLimit?.ignoreIntrospection ?? true,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        costLimitRule(this.options, (message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }),
      ],
    };
  }
}
