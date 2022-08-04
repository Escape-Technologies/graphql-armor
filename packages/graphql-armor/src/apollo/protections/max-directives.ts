import { ApolloProtection, ApolloServerConfigurationEnhancement } from './base-protection';
import { MaxDirectivesOptions } from '../../config';
import { GraphQLError } from 'graphql';
import { maxDirectivesRule } from '../../validationRules/max-directives';

export class ApolloMaxDirectivesProtection extends ApolloProtection {
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

  protect(): ApolloServerConfigurationEnhancement {
    return {
      validationRules: [
        maxDirectivesRule(this.options, (message: string) => {
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }),
      ],
    };
  }
}
