import type { Plugin } from '@envelop/core';
import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError } from 'graphql';

export type CharacterLimitOptions = { maxLength?: number } & GraphQLArmorCallbackConfiguration;
export const characterLimitDefaultOptions: Required<CharacterLimitOptions> = {
  maxLength: 15000,
  onAccept: [],
  onReject: [],
  throwOnRejection: true,
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
          const err = new GraphQLError(
            `Syntax Error: Character limit of ${config.maxLength} exceeded, found ${query.length}.`,
          );

          for (const handler of config.onReject) {
            handler(null, err);
          }

          if (config.throwOnRejection) {
            throw err;
          }
        } else {
          for (const handler of config.onAccept) {
            handler(null, { query });
          }
        }

        return parseFn(source, options);
      });
    },
  };
};
