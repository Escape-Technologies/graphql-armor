import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { MaxDirectivesOptions } from '../../config';
import { GraphQLError } from 'graphql';
import { Plugin } from '@envelop/core';
import { maxDirectivesRule } from '../../validationRules/max-directives';

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
