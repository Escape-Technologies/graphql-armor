import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

import { CharacterLimitOptions } from '../../config';
import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';

const plugin = ({ maxLength }: CharacterLimitOptions): Plugin => {
  return {
    onParse({ context }: any) {
      if (context.query.length > maxLength) {
        new GraphQLError(`Query too large.`);
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
      maxLength: this.config.characterLimit?.maxLength || 15000,
    };
  }

  protect(): EnvelopConfigurationEnhancement {
    return {
      plugins: [plugin(this.options)],
    };
  }
}
