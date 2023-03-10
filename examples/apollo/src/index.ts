import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';

import { app, httpServer, server } from './server';

(async () => {
  await server.start();
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>((resolve) => {
    const x = httpServer.listen({ port: 4000 }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
})();
