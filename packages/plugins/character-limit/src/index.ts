import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type CharacterLimitOptions = { maxLength: number };
const characterLimitPlugin = ({ maxLength }: CharacterLimitOptions): Plugin => {
  return {
    onParse({ context }: any) {
      if (context.query.length > maxLength) {
        new GraphQLError(`Query too large.`);
      }
    },
  };
};

export { characterLimitPlugin, CharacterLimitOptions };
