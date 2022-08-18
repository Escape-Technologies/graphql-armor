import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type BlockFieldSuggestionOptions = { mask?: string };

const formatter = (error: GraphQLError, mask = '[Suggestion message hidden by GraphQLArmor]'): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean ".+"/g, mask);
  }
  return error as GraphQLError;
};

const blockFieldSuggestionsPlugin = (options?: BlockFieldSuggestionOptions): Plugin => {
  return {
    onValidate: () => {
      return function onValidateEnd({ valid, result, setResult }) {
        if (!valid) {
          setResult(result.map((error) => formatter(error, options?.mask)));
        }
      };
    },
  };
};

export { blockFieldSuggestionsPlugin };
