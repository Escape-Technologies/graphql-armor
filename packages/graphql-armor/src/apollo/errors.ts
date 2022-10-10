import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError, ValidationContext } from 'graphql';

export const reportToContext = (ctx: ValidationContext | null, error: GraphQLError) => {
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
 * Default `rejection` handler will be used only if throw is explicitly set to true.
 * If set to false, nothing will happen.
 */
export const inferApolloPropagator = <T extends GraphQLArmorCallbackConfiguration | undefined>(config: T): T => {
  if (config === undefined) {
    config = {} as T & GraphQLArmorCallbackConfiguration;
  }

  if (config.onReject === undefined) {
    config.onReject = [];
  }

  if (config.propagateOnRejection === true || config.propagateOnRejection === undefined) {
    config.propagateOnRejection = false;
    config.onReject.push(reportToContext);
  }

  return config;
};
