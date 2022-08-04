import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';
import { MaxDepthOptions } from '../../config';
import { ApolloError } from 'apollo-server-core';
import { maxDepthRule } from '../../validationRules/max-depth';

export class ApolloMaxDepthProtection extends ApolloProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxDepth) return true;
    return this.config.maxDepth.enabled;
  }

  get options(): MaxDepthOptions {
    return {
      n: this.config.maxDepth?.options?.n || 6,
    };
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxDepthRule(this.options, (message: string) => {
          throw new ApolloError(message, 'BAD_USER_INPUT');
        }),
      ],
    };
  }
}
