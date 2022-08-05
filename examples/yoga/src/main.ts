import { EnvelopArmor } from '@escape.tech/graphql-armor';
import { createServer } from '@graphql-yoga/node';

import { schema } from './schema';

const armor = new EnvelopArmor();
const enhancements = armor.protect();

async function main() {
  const server = createServer({
    schema,
    plugins: [...enhancements.plugins],
  });
  await server.start();
}

main();
