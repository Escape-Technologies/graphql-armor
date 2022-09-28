import { GraphQLError, ValidationContext } from 'graphql';

export const badInputHandler = (_context: ValidationContext, error: GraphQLError) => {
  throw new GraphQLError(error.message, {
    extensions: { code: 'BAD_USER_INPUT' },
  });
};

export const badInputContextHandler = (context: ValidationContext, error: GraphQLError) => {
  context.reportError(
    new GraphQLError(error.message, {
      extensions: { code: 'BAD_USER_INPUT' },
    }),
  );
};
