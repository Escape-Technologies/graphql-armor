import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type BlockFieldSuggestionsOptions = { mask?: string };
const blockFieldSuggestionsDefaultOptions: Required<BlockFieldSuggestionsOptions> = {
  mask: '[Suggestion hidden]',
};

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean .+"\?/g, mask).trim();
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
    onExecute: () => {
      return {
        onExecuteDone({ result, setResult }) {
          // Ensure that the result object contains an errors property and that it is an array
          if (result && 'errors' in result && Array.isArray(result.errors)) {
            setResult({
              ...result,
              errors: result.errors.map((error: GraphQLError) => formatter(error, mask)),
            });
          }
        },
      };
    },
  };
};

export { blockFieldSuggestionsPlugin, blockFieldSuggestionsDefaultOptions, BlockFieldSuggestionsOptions };
