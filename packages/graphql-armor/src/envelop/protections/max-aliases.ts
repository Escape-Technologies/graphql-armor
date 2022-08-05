import type { Plugin } from '@envelop/core';
import { MaxAliasesOptions, maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';
import { GraphQLError } from 'graphql';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

const plugin = (options: MaxAliasesOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxAliasesRule(options, (msg: string) => {
          throw new GraphQLError(msg);
        }),
      );
    },
  };
};

export class EnvelopMaxAliasesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxAliases) return true;
    return this.config.maxAliases.enabled;
  }

  get options(): MaxAliasesOptions {
    return {
      n: this.config.maxAliases?.options?.n || 15,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
