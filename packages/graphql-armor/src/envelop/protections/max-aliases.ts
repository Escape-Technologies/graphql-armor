import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { MaxAliasesOptions } from '../../config';
import { GraphQLError } from 'graphql';
import { Plugin } from '@envelop/core';
import { maxAliasesRule } from '../../validationRules/max-aliases';

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
