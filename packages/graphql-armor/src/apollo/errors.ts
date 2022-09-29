import { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError, ValidationContext } from 'graphql';

export const badInputHandler = (ctx: ValidationContext | null, error: GraphQLError) => {
  if (ctx) {
    throw new GraphQLError(error.message, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

export const badInputContextHandler = (ctx: ValidationContext | null, error: GraphQLError) => {
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
 * If set to false, nothing will happen.
 */
export const badInputHandlerSelector = <T extends GraphQLArmorCallbackConfiguration | undefined>(config: T): T => {
  if (config === undefined) {
    config = {} as T & GraphQLArmorCallbackConfiguration;
  }

  if (config.onReject === undefined) {
    config.onReject = [];
  }

  if (config.throwOnRejection) {
    config.onReject.push(badInputHandler);
  } else if (config.throwOnRejection === undefined) {
    config.onReject.push(badInputContextHandler);
  }

  return config;
};
