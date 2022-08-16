import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

const formatter = (error: GraphQLError): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean ".+"/g, '[Suggestion message hidden by GraphQLArmor]');
  }
  return error as GraphQLError;
};

const blockFieldSuggestionsPlugin = (): Plugin => {
  return {
    onValidate: () => {
      return function onValidateEnd({ valid, result, setResult }) {
        if (!valid) {
          setResult(result.map((error) => formatter(error)));
        }
      };
    },
  };
};

export { blockFieldSuggestionsPlugin };
