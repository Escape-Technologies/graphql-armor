# GraphQL Armor 🛡️

*This project is young so there might be bugs but we are very reactive so feel free to open issues.*

GraphQL Armor is a dead-simple yet highly customizable security middleware for various GraphQL server engines.

![GraphQL-Armor banner](https://raw.githubusercontent.com/Escape-Technologies/graphql-armor/main/packages/docs/banner.png)

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![CD](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor)

## Contents

- [Contents](#contents)
- [Supported remediations](#supported-remediations)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Getting Started with Configuration](#getting-started-with-configuration)
- [Per plugin configuration](#per-plugin-configuration)
- [Contributing](#contributing)

## Supported GraphQL Engines

We support the following engines :
- [Apollo Server](https://www.apollographql.com/)
- [GraphQL Yoga](https://www.graphql-yoga.com/)

We additionnaly support the following engines through the [Envelop](https://www.envelop.dev/) plugin system :
- GraphQL-Helix
- Node.js HTTP
- GraphQL-WS
- GraphQL-SSE
- Azure Functions
- Cloudflare Workers
- Google Cloud Functions
- Lambda AWS
- type-graphql
- nexus
- express-graphql

See [here](https://www.envelop.dev/docs/integrations) for more information about Envelop compatibility.

## Getting Started

Refer to the [Examples directory](https://github.com/Escape-Technologies/graphql-armor/tree/main/examples) for specific implementation examples. (such as NestJS with Apollo Server)

### Apollo Server

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...armor.protect()
});
```

If you already have some plugins or validation rules, proceed this way:

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor();
const protection = armor.protect()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...protection,
  plugins: [...enhancements.plugins, myPlugin1, myPlugin2 ]
  validationRules: [, ...enhancements.validationRules, myRule1, myRule2 ]
});
```

### GraphQL Yoga

```typescript
(TODO)
```

### Envelop

```typescript
(TODO)
```

## Getting Started with configuration

GraphQL Armor is fully configurable in a per-plugin fashion.

View the [per plugin configuration section](#per-plugin-configure) for more information about how to configure each plugin separately.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    costAnalysis: {
        options: {
            maxCost: 1000,
        },
    },
    characterLimit: {
      options: {
          maxLength: 15000,
      },
  }
});
```

## Per plugin configuration

The provided values are the default values.

This section describes how to configure each plugin individually.
  - [Stacktraces](#stacktraces)
  - [Batched queries](#batched-queries)
  - [Character Limit](#character-limit)
  - [Cost Analysis](#cost-analysis)
  - [Field Suggestion](#field-suggestion)
  - [Aliases Limit](#aliases-limit)
  - [Directives Limit](#directives-limit)
  - [Depth Limit](#depth-limit)

### Stacktraces

This plugin is for Apollo Server only, and is enabled by default.

Stacktraces are managed by the Apollo configuration parameter `debug` which may have `true` as a default value in some setups. GraphQL Armor changes this default value to `false`.

For rolling back to Apollo's default parameter, you can use the following code:

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...armor.protect(),
  debug: true // Ignore Armor's recommandation
});
```

### Batched queries

This plugin is for Apollo Server only, and is enabled by default.

Batched queries are enabled by default, which makes DoS attacks easier by stacking expensive requests. We make them disabled by default.

For rolling back to Apollo's default parameter, you can use the following code:

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...armor.protect(),
  allowBatchedHttpRequests: true // Ignore Armor's recommandations
});
```

### Character Limit

This plugin is enabled by default.

The `Character Limit plugin` will enforce a character limit on your GraphQL queries.

The limit is not applied to the whole HTTP body - multipart form data/file upload will still work.

Configuration
```typescript
{
  characterLimit: {
      enabled: true,
      options: {
          maxLength: 15000,
      },
  }
}
```

### Cost Analysis

This plugin is enabled by default.

The `Cost Analysis plugin` analyzes incoming GraphQL queries and applies a cost analysis algorithm to prevent resource overload by blocking too expensive requests (DoS attack attempts).

Configuration
```typescript
{
  costAnalysis: {
      enabled: true,
      options: {
          maxCost: 5000,       
          maxCost: number,
          objectCost: number,
          scalarCost: number,
          depthCostFactor: number, // multiplicative cost of depth
          ignoreIntrospection: true, // by default, introspection queries are ignored.
      },
  }
}
```

### Field Suggestion

This plugin is enabled by default.

It will prevent suggesting fields in case of an erroneous request. Suggestions can lead to the leak of your schema even with disabled introspection, which can be very detrimental in case of a private API. One could use [GraphDNA](https://github.com/Escape-Technologies/graphdna) to recover an API schema even with disabled introspection, as long as field suggestions are enabled.

Example of such a suggestion : 

`Cannot query field "sta" on type "Media". Did you mean "stats", "staff", or "status"?`

Configuration
```typescript
{
  blockFieldSuggestion: {
      enabled: true,
  }
}
```
### Aliases Limit

This plugin is enabled by default.

Configuration
```typescript
{
  maxAliases: {
      enabled: true,
      options: {
          n: 15,
      },
  }
}
```

### Directives Limit

This plugin is enabled by default.

```typescript
{
  maxDirectives: {
      enabled: true,
      options: {
          n: 50,
      },
  }
}
```

### Depth Limit

This plugin is enabled by default.

```typescript
{
  maxDepth: {
      enabled: true,
      options: {
          n: 6,
      },
  }
}
```


## Contributing

Ensure you have read the [Contributing Guide](https://github.com/Escape-Technologies/graphql-armor/blob/main/CONTRIBUTING.md) before contributing.

To setup your project, make sure you run the `install-dev.sh` script.

```bash
git clone git@github.com:Escape-Technologies/graphql-armor.git
cd graphql-armor
bash ./install-dev.sh
```

We are using yarn as our package manager and [the workspaces monorepo setup](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Please read the associated documentation and feel free to open issues if you encounter problems when developing on our project!
