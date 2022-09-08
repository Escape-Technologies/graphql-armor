import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';
import { createServer } from '@graphql-yoga/node';

import { schema } from './schema';

export function initServer() {
  const server = createServer({
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
      }),
    ],
  });
  return server;
}
