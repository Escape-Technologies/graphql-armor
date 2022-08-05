import type { Plugin as EnvelopPlugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

export type HookErrorOpts = {
  formatter: (error: GraphQLError) => GraphQLError;
};

export const hookErrors = (opts: HookErrorOpts): EnvelopPlugin => {
  return {
    onValidate: () => {
      return function onValidateEnd({ valid, result, setResult }) {
        if (!valid) {
          setResult(result.map((error) => opts.formatter(error)));
        }
      };
    },
  };
};
