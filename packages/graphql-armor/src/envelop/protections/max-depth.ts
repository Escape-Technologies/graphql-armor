import type { Plugin } from '@envelop/core';
import { MaxDepthOptions, maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
import { GraphQLError } from 'graphql';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

const plugin = (options: MaxDepthOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxDepthRule(options, (msg: string) => {
          throw new GraphQLError(msg);
        }),
      );
    },
  };
};

export class EnvelopMaxDepthProtection extends EnvelopProtection {
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

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
