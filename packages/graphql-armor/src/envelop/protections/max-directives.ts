import type { Plugin } from '@envelop/core';
import { MaxDirectivesOptions, maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';
import { GraphQLError } from 'graphql';

import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

const plugin = (options: MaxDirectivesOptions): Plugin => {
  return {
    onValidate({ addValidationRule }: any) {
      addValidationRule(
        maxDirectivesRule(options, (msg: string) => {
          throw new GraphQLError(msg);
        }),
      );
    },
  };
};

export class EnvelopMaxDirectivesProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.maxDirectives) return true;
    return this.config.maxDirectives.enabled;
  }

  get options(): MaxDirectivesOptions {
    return {
      n: this.config.maxDirectives?.options?.n || 50,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
