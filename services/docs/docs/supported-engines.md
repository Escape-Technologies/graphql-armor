---
sidebar_position: 2
---

# Supported Engines

Currently, GraphQL Armor supports the following engines:

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Yoga](https://www.the-guild.dev/graphql/yoga-server)

We also support [Envelop](https://envelop.dev) which is a plugin system for GraphQL servers.

Through Envelop, you can use GraphQL Armor with the following engines:

- Yoga Server
- GraphQL-Helix
- Node.js HTTP
- GraphQL-Helix
- GraphQL-WS
- GraphQL-SSE
- Azure Functions
- Cloudflare Workers
- Google Cloud Functions
- Lambda AWS
- type-graphql
- nexus
- express-graphql

> From [Envelop Compatibility Table](https://www.the-guild.dev/graphql/envelop/docs/integrations#compatibility-table)

---

Our validations rules and plugins were built to be supported on [GraphQL JS](https://github.com/graphql/graphql-js), if you use an Engine that is not supported but uses GraphQL JS, you should be able to use GraphQL Armor plugins.
