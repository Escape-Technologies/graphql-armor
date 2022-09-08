import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type BlockFieldSuggestionsOptions = { mask?: string };
const blockFieldSuggestionsDefaultOptions: Required<BlockFieldSuggestionsOptions> = {
  mask: '[Suggestion hidden]',
};

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean ".+"/g, mask);
  }
  return error as GraphQLError;
};

const blockFieldSuggestionsPlugin = (options?: BlockFieldSuggestionsOptions): Plugin => {
  const mask = options?.mask ?? blockFieldSuggestionsDefaultOptions.mask;

  return {
    onValidate: () => {
      return function onValidateEnd({ valid, result, setResult }) {
        if (!valid) {
          setResult(result.map((error) => formatter(error, mask)));
        }
      };
    },
  };
};

export { blockFieldSuggestionsPlugin, blockFieldSuggestionsDefaultOptions, BlockFieldSuggestionsOptions };
