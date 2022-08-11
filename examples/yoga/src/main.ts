import { initServer } from './server';

const server = initServer();

(async () => {
  await server.start();
})();
