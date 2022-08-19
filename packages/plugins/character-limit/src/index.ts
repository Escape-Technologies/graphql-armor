import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type CharacterLimitOptions = { maxLength?: number };
const characterLimitDefaultOptions: CharacterLimitOptions = {
  maxLength: 15000,
};

const characterLimitPlugin = (options?: CharacterLimitOptions): Plugin<object> => {
  const maxLength = options?.maxLength ?? characterLimitDefaultOptions.maxLength;

  return {
    onParse({ parseFn, setParseFn }) {
      setParseFn((source, options) => {
        const query = typeof source === 'string' ? source : source.body;

        if (query && query.length > maxLength!) {
          throw new GraphQLError(`Query is too large.`);
        }

        return parseFn(source, options);
      });
    },
  };
};

export { characterLimitPlugin, CharacterLimitOptions, characterLimitDefaultOptions };
