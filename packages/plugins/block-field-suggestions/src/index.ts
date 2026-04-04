import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';

type BlockFieldSuggestionsOptions = {
  /**
   * Mask applied to the error message.
   * @default '[Suggestion hidden]'
   */
  mask?: string;
};
const blockFieldSuggestionsDefaultOptions: Required<BlockFieldSuggestionsOptions> = {
  mask: '[Suggestion hidden]',
};

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
  if (error instanceof GraphQLError && typeof error.message === 'string') {
    error.message = error.message.replace(/Did you mean ".+"\?/g, mask).trim();
  }
  return error as GraphQLError;
};

/**
 * Prevent returning field suggestions and leaking your schema to unauthorized actors.
 *
 * In production, this can lead to Schema leak even if the introspection is disabled.
 *
 * Use with `@envelop/core` from `@the-guild-org`.
 */
const blockFieldSuggestionsPlugin = <PluginContext extends Record<string, any> = {}>(
  options?: BlockFieldSuggestionsOptions,
): Plugin<PluginContext> => {
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
