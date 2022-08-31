# GraphQL Armor 🛡️

GraphQL Armor is a dead-simple yet highly customizable security middleware for various GraphQL server engines.

![GraphQL-Armor banner](https://raw.githubusercontent.com/Escape-Technologies/graphql-armor/main/packages/docs/banner.png)

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![release](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml) [![e2e](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/e2e.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/e2e.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor) [![codecov](https://codecov.io/gh/Escape-Technologies/graphql-armor/branch/main/graph/badge.svg)](https://codecov.io/gh/Escape-Technologies/graphql-armor)

## Contents

- [Contents](#contents)
- [Supported GraphQL Engines](#supported-graphql-engines)
- [Getting Started](#getting-started)
  - [Apollo Server](#apollo-server)
  - [GraphQL Yoga](#graphql-yoga)
  - [Envelop](#envelop)
- [Getting Started with configuration](#getting-started-with-configuration)
- [Per plugin configuration](#per-plugin-configuration)
  - [Stacktraces (Apollo Only)](#stacktraces-apollo-only)
  - [Batched queries (Apollo Only)](#batched-queries-apollo-only)
  - [Aliases Limit](#aliases-limit)
  - [Character Limit](#character-limit)
  - [Cost Limit](#cost-limit)
  - [Depth Limit](#depth-limit)
  - [Directives Limit](#directives-limit)
  - [Field Suggestion](#field-suggestion)
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

## Installation

```bash
# npm
npm install -S @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

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
  plugins: [...protection.plugins, myPlugin1, myPlugin2 ]
  validationRules: [, ...protection.validationRules, myRule1, myRule2 ]
});
```

### GraphQL Yoga

```typescript
import { EnvelopArmor } from '@escape.tech/graphql-armor';

const armor = new EnvelopArmor();
const protection = armor.protect()

async function main() {
  const server = createServer({
    schema,
    plugins: [...protection.plugins],
  });
  await server.start();
}

main();
```

```typescript
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';

async function main() {
  const server = createServer({
    schema,
    plugins: [EnvelopArmorPlugin()],
  });
  await server.start();
}

main();
```

### Envelop

```typescript
import { EnvelopArmor } from '@escape.tech/graphql-armor';

const armor = new EnvelopArmor();
const protection = armor.protect()

const getEnveloped = envelop({
  plugins: [otherPlugins, ...protection.plugins],
});
```

```typescript
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';

const getEnveloped = envelop({
  plugins: [otherPlugins, EnvelopArmorPlugin()],
});
```

## Getting Started with configuration

GraphQL Armor is fully configurable in a per-plugin fashion.

View the [per plugin configuration section](#per-plugin-configure) for more information about how to configure each plugin separately.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    costLimit: {
        maxCost: 1000,
    },
    characterLimit: {
        maxLength: 15000,
    }
  }
});
```

## Per plugin configuration

The provided values are the default values.

This section describes how to configure each plugin individually.

- [Stacktraces (Apollo Only)](#stacktraces-apollo-only)
- [Batched queries (Apollo Only)](#batched-queries-apollo-only)
- [Aliases Limit](#aliases-limit)
- [Character Limit](#character-limit)
- [Cost Limit](#cost-limit)
- [Depth Limit](#depth-limit)
- [Directives Limit](#directives-limit)
- [Field Suggestion](#field-suggestion)

### Stacktraces (Apollo Only)

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

### Batched queries (Apollo Only)

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

It enforces a character limit on your GraphQL queries.

The limit is not applied to the whole HTTP body - multipart form data/file upload will still work.

Configuration

```typescript
{
  characterLimit: {
    // enabled: true,
    maxLength: 15000,
  }
}
```

### Cost Limit

This plugin is enabled by default.

It analyzes incoming GraphQL queries and applies a cost analysis algorithm to prevent resource overload by blocking too expensive requests (DoS attack attempts).

The cost computation is quite simple (and naive) at the moment but there are plans to make it evolve toward a extensive plugin with many features.

Configuration

```typescript
{
  costLimit: {
    // enabled: true,
    maxCost: 5000, // maximum cost of a request before it is rejected
    objectCost: 2, // cost of retrieving an object
    scalarCost: 1, // cost of retrieving a scalar
    depthCostFactor: 1.5, // multiplicative cost of depth
    ignoreIntrospection: true, // by default, introspection queries are ignored.
  }
}
```

### Field Suggestion

This plugin is enabled by default.

It will prevent suggesting fields in case of an erroneous request. Suggestions can lead to the leak of your schema even with disabled introspection, which can be very detrimental in case of a private API. One could use [GraphDNA](https://github.com/Escape-Technologies/graphdna) to recover an API schema even with disabled introspection, as long as field suggestions are enabled.

Example of such a suggestion:

`Cannot query field "sta" on type "Media". Did you mean "stats", "staff", or "status"?`

```typescript
{
  blockFieldSuggestion: {
    // enabled: true,
  }
}
```

### Aliases Limit

This plugin is enabled by default.

Put a limit on the number of aliases.

```typescript
{
  maxAliases: {
    // enabled: true,
    n: 15,
  }
}
```

### Directives Limit

This plugin is enabled by default.

Put a limit on the number of directives.

```typescript
{
  maxDirectives: {
    // enabled: true,
    n: 50,
  }
}
```

### Depth Limit

This plugin is enabled by default.

Put a depth limit to the request.

```typescript
{
  maxDepth: {
    // enabled: true,
    n: 6,
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

*This project is young so there might be bugs but we are very reactive so feel free to open issues.*
