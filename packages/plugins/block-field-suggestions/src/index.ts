import type { Plugin } from '@envelop/core';
import type { GraphQLArmorValidateConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError } from 'graphql';

type BlockFieldSuggestionsOptions = {
  mask?: string;
};

const blockFieldSuggestionsDefaultOptions: Required<BlockFieldSuggestionsOptions> = {
  mask: '[Suggestion hidden]',
};

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean ".+"/g, mask);
  }
  return error as GraphQLError;
};

function blockFieldSuggestionsPlugin<PluginContext extends Record<string, unknown> = {}>(
  options?: BlockFieldSuggestionsOptions & GraphQLArmorValidateConfiguration<PluginContext>,
): Plugin<PluginContext> {
  const mask = options?.mask ?? blockFieldSuggestionsDefaultOptions.mask;
  const enabled = typeof options?.enabled === 'function' ? options.enabled : () => options?.enabled ?? true;

  return {
    onValidate: ({ params, context }) => {
      if (!enabled({ params, context })) return;

      return function onValidateEnd({ valid, result, setResult }) {
        if (!valid) {
          setResult(result.map((error) => formatter(error, mask)));
        }
      };
    },
  };
}

export { blockFieldSuggestionsPlugin, blockFieldSuggestionsDefaultOptions, BlockFieldSuggestionsOptions };
