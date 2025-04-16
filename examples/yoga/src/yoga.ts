import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';
import type { GraphQLError, ValidationContext } from 'graphql';
import { createYoga } from 'graphql-yoga';

import { schema } from './schema';



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
      },
      maxAliases: {
        enabled: true,
        n: 1,
      },
      maxDirectives: {
        n: 10,
      },
      maxDepth: {
        n: 4,
      },
      maxTokens: {
        n: 250,
      },
    }),
  ],
});
