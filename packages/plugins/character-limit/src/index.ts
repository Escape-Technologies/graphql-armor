import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

export type CharacterLimitOptions = { maxLength?: number };
export const characterLimitDefaultOptions: Required<CharacterLimitOptions> = {
  maxLength: 15000,
};

export const characterLimitPlugin = (options?: CharacterLimitOptions): Plugin => {
  const config = Object.assign(
    {},
    characterLimitDefaultOptions,
    ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
  );

  return {
    onParse({ parseFn, setParseFn }) {
      setParseFn((source, options) => {
        const query = typeof source === 'string' ? source : source.body;

        if (query && query.length > config.maxLength) {
          throw new GraphQLError(
            `Syntax Error: Character limit of ${config.maxLength} exceeded, found ${query.length}.`,
          );
        }

        return parseFn(source, options);
      });
    },
  };
};
