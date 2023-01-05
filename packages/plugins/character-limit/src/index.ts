import type { Plugin } from '@envelop/core';
import type {
  GraphQLArmorCallbackConfiguration,
  GraphQLArmorParseConfiguration,
} from '@escape.tech/graphql-armor-types';
import { GraphQLError } from 'graphql';

export type CharacterLimitOptions = { maxLength?: number } & GraphQLArmorCallbackConfiguration;

export const characterLimitDefaultOptions: Required<CharacterLimitOptions> = {
  maxLength: 15000,
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

export function characterLimitPlugin<PluginContext extends Record<string, unknown>>(
  options?: CharacterLimitOptions & GraphQLArmorParseConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const config = Object.assign(
    {},
    characterLimitDefaultOptions,
    ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
  );
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;

  return {
    onParse({ parseFn, setParseFn, params, context }) {
      if (!enabled({ context, params })) return;

      setParseFn((source, options) => {
        const query = typeof source === 'string' ? source : source.body;

        if (query && query.length > config.maxLength) {
          const err = new GraphQLError(
            `Syntax Error: Character limit of ${config.maxLength} exceeded, found ${query.length}.`,
          );

          for (const handler of config.onReject) {
            handler(null, err);
          }

          if (config.propagateOnRejection) {
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
}
