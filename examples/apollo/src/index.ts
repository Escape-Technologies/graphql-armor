import { server } from './server';

const express = require('express');
const app = express();

const http = require('http');
const httpServer = http.createServer(app);

(async () => {
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  await new Promise<void>((resolve) => {
    const x = httpServer.listen({ port: 4000 }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
