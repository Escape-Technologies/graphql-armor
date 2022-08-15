import { EnvelopArmor } from '@escape.tech/graphql-armor';
import { createServer } from '@graphql-yoga/node';

import { schema } from './schema';

export function initServer() {
  const server = createServer({
    schema,
    plugins: [new EnvelopArmor()],
  });
  return server;
}
