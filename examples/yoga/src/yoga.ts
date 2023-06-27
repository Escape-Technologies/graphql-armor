import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';
import type { GraphQLError, ValidationContext } from 'graphql';
import { createYoga } from 'graphql-yoga';

import { schema } from './schema';

const logAcceptance = (ctx: ValidationContext | null) => {
  if (ctx) {
    console.debug(`accepted context: ${JSON.stringify(ctx, null, 2)}`);
  }
};

const logRejection = (ctx: ValidationContext | null, error: GraphQLError) => {
  if (ctx) {
    console.debug(`rejection context: ${JSON.stringify(ctx, null, 2)}`);
  }
  console.debug(`rejected request: ${error}`);
};

export const yoga = createYoga({
  schema,
  plugins: [
    EnvelopArmorPlugin({
      costLimit: {
        enabled: true,
        maxCost: 100,
        objectCost: 1,
        scalarCost: 1,
        depthCostFactor: 2,
        ignoreIntrospection: true,
        onAccept: [logAcceptance],
        onReject: [logRejection],
      },
      maxAliases: {
        enabled: true,
        n: 1,
        onAccept: [logAcceptance],
        onReject: [logRejection],
      },
      maxDirectives: {
        n: 10,
        onAccept: [logAcceptance],
        onReject: [logRejection],
      },
      maxDepth: {
        n: 4,
        onAccept: [logAcceptance],
        onReject: [logRejection],
      },
      maxTokens: {
        n: 250,
        onAccept: [logAcceptance],
        onReject: [logRejection],
      },
    }),
  ],
});
