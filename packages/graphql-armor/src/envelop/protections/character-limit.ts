import { EnvelopConfigurationEnhancement, EnvelopProtection } from './base-protection';
import { CharacterLimitOptions } from '../../config';
import { GraphQLError } from 'graphql';

const plugin = ({ maxLength }: CharacterLimitOptions) => {
  return {
    onParse({ context }) {
      if (context.query.length > maxLength) {
        return function onParseEnd({ replaceParseResult }) {
          replaceParseResult(new GraphQLError(`Query too large.`));
        };
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
