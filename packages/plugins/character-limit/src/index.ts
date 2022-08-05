import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

export type CharacterLimitOptions = { maxLength: number };

export const characterLimitOptionsDefaults: CharacterLimitOptions = { maxLength: 15000 };

export const characterLimitPlugin = ({ maxLength }: CharacterLimitOptions): Plugin => {
  return {
    onParse({ context }: any) {
      if (context.query.length > maxLength) {
        new GraphQLError(`Query too large.`);
      }
    },
  };
};
