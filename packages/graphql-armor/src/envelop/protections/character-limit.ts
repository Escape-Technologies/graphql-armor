import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { CharacterLimitOptions } from '../../config';
import { GraphQLError } from 'graphql';
import { Plugin } from '@envelop/core';

const plugin = ({ maxLength }: CharacterLimitOptions): Plugin => {
  return {
    onParse({ context }: any) {
      if (context.query.length > maxLength) {
        context.reportError(new GraphQLError(`Query too large.`));
      }
    },
  };
};

export class EnvelopCharacterLimitProtection extends EnvelopProtection {
  get isEnabled(): boolean {
    // default
    if (!this.config.characterLimit) return true;
    return this.config.characterLimit.enabled;
  }

  get options(): CharacterLimitOptions {
    return {
      maxLength: this.config.characterLimit?.options?.maxLength || 15000,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
