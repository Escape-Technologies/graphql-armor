import { CostLimitOptions, costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

export class EnvelopCostLimitProtection extends EnvelopProtection {
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

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [costLimitPlugin(this.options)],
    };
  }
}
