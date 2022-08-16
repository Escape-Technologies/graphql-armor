import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type AfterParseCtx = { query: string | undefined };
type CharacterLimitOptions = { maxLength?: number };
const characterLimitDefaultOptions: CharacterLimitOptions = {
  maxLength: 15000,
};

const characterLimitPlugin = (options?: CharacterLimitOptions): Plugin<AfterParseCtx> => {
  const maxLength = options?.maxLength ?? characterLimitDefaultOptions.maxLength;

  return {
    onParse({ context }) {
      if (context.query && context.query.length > maxLength!) {
        throw new GraphQLError(`Query is too large.`);
      }
    },
  };
};

export { characterLimitPlugin, CharacterLimitOptions, characterLimitDefaultOptions };
