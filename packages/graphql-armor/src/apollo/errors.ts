import { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError, ValidationContext } from 'graphql';

const badInputHandler = (ctx: ValidationContext | null, error: GraphQLError) => {
  if (ctx) {
    throw new GraphQLError(error.message, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

const badInputContextHandler = (ctx: ValidationContext | null, error: GraphQLError) => {
  if (ctx) {
    ctx.reportError(
      new GraphQLError(error.message, {
        extensions: { code: 'BAD_USER_INPUT' },
      }),
    );
  }
};

/*
 * We want to use by default the context handler, because it allows us to
 * return a 400 error code, instead of 500 for the apollo server.
 *
 * Default `throw` handler will be used only if throw is explicitly set to true.
 */
export const badInputHandlerSelector = <T extends GraphQLArmorCallbackConfiguration | undefined>(config: T): Required<T> => {
  if (config === undefined) {
    config = {} as T & GraphQLArmorCallbackConfiguration;
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
