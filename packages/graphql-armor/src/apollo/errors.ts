import { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError, ValidationContext } from 'graphql';

const badInputHandler = (_context: ValidationContext, error: GraphQLError) => {
  throw new GraphQLError(error.message, {
    extensions: { code: 'BAD_USER_INPUT' },
  });
};

const badInputContextHandler = (context: ValidationContext, error: GraphQLError) => {
  context.reportError(
    new GraphQLError(error.message, {
      extensions: { code: 'BAD_USER_INPUT' },
    }),
  );
};

/*
 * We want to use by default the context handler, because it allows us to
 * return a 400 error code, instead of 500 for the apollo server.
 *
 * Default `throw` handler will be used only if throw is explicitly set to true.
 */
export const badInputHandlerSelector = (config: any): any => {
  if (config == undefined) {
    config = {};
  }

  if (config.onReject == undefined) {
    config.onReject = [];
  }

  if (config.throwRejection === undefined || config.throwRejection) {
    config.onReject.push(badInputHandler);
  } else {
    config.onReject.push(badInputContextHandler);
  }

  return config;
};
