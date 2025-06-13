import type { Plugin } from '@envelop/core';
import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError } from 'graphql';

export type CharacterLimitOptions = {
  maxLength?: number;
  exposeLimits?: boolean;
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

export const characterLimitDefaultOptions: Required<CharacterLimitOptions> = {
  maxLength: 15000,
  exposeLimits: true,
  errorMessage: 'Query validation error.',
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

/* CharacterLimitPlugin Supports Apollo Server v3 and v4 */
export const ApolloServerCharacterLimitPlugin = function (options?: CharacterLimitOptions): any {
  const config = Object.assign(
    {},
    characterLimitDefaultOptions,
    ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
  );

  return {
    requestDidStart(requestContext: any): Promise<any> | undefined {
      const { request } = requestContext;

      if (!request?.query) {
        return;
      }
      const queryLength = request.query.length;

      if (queryLength > config.maxLength) {
        const message = config.exposeLimits
          ? `Query exceeds the maximum allowed length of ${config.maxLength}, found ${queryLength}.`
          : config.errorMessage;
        throw new GraphQLError(message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      for (const handler of config.onAccept) {
        handler(null, { queryLength });
      }
    },
  };
};

export const characterLimitPlugin = <PluginContext extends Record<string, any> = {}>(
  options?: CharacterLimitOptions,
): Plugin<PluginContext> => {
  const config = Object.assign(
    {},
    characterLimitDefaultOptions,
    ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
  );

  return {
    onParse({ parseFn, setParseFn }: any) {
      setParseFn((source: string | { body: string }, options: any) => {
        const query = typeof source === 'string' ? source : source.body;
        const queryLength = query.length;

        if (query && queryLength > config.maxLength) {
          const message = config.exposeLimits
            ? `Character limit of ${config.maxLength} exceeded, found ${queryLength}.`
            : config.errorMessage;
          const err = new GraphQLError(`Syntax Error: ${message}`);

          for (const handler of config.onReject) {
            handler(null, err);
          }

          if (config.propagateOnRejection) {
            throw err;
          }
        } else {
          for (const handler of config.onAccept) {
            handler(null, { queryLength });
          }
        }

        return parseFn(source, options);
      });
    },
  };
};
