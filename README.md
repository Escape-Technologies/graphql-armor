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

TODO : update
```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';
const armor = new ApolloArmor({
    // Config opts
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // This will add a `validationRules` and a `plugins` property to the configuration object
  ...armor.protect()
});

// If you want to enhance an already existing plugins or validation rules list
const enhancements = armor.protect()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [...myPlugins, ...enhancements.plugins]
  validationRules: [...myValidationRules, ...enhancements.validationRules]
});
```

### GraphQL Yoga


TODO : update
```typescript
```

### Envelop


TODO : update
```typescript
```

## Getting Started with configuration

GraphQL Armor is fully configurable in a per-plugin fashion.

View the [Per plugin configuration](#per-plugin-configure) section for more information about how to configure each plugin separately.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    costAnalysis: {
        enabled: true,
        options: {
            maxCost: 1000,
        },
    }
});
```

## Per plugin configuration

The provided values correspond to default value.

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

This plugin is enabled by default.

Stacktraces are managed by the configuration parameter `debug` defaulting to `true` in Apollo. GraphQLArmor changes this default value to `false`.

For rolling back to Apollo's default parameter, you can use the following code:

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  ...armor.protect(),
  debug: true // Ignore Armor's recommandations
});
```

### Batched queries

This plugin is enabled by default.

Stacktraces are managed by the configuration parameter `debug` defaulting to `true` in Apollo. GraphQLArmor changes this default value to `false`.

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

(Note: The limit is not applied to the whole HTTP body -, multipart form data/file upload will still works)

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    characterLimit: {
        enabled: true,
        options: {
            maxLength: 15000, // Default: 15000
        },
    }
});
```

### Cost Analysis

This plugin is enabled by default.

The `Cost Analysis plugin` analyzes incoming GraphQL queries and apply cost analysis algorithm to prevent resource overload.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    costAnalysis: {
        enabled: true,
        options: {
            maxCost: 5000,          // Default: 5000
            defaultComplexity: 1,   // Default: 1    | Complexity of GQL token
            maxDepth: 6,            // Default: 6
            maxAlias: 15,           // Default: 15
            maxDirectives: 50,      // Default: 50
        },
    }
});
```

### Field Suggestion

This plugin is enabled by default.

The `Field Suggestion plugin` will prevent suggesting fields of unprecise GraphQL queries.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    blockFieldSuggestion: {
        enabled: true,
    }
});
```
### Aliases Limit

This plugin is enabled by default.

### Directives Limit

This plugin is enabled by default.


### Depth Limit

This plugin is enabled by default.


## Contributing

Ensure you have read the [Contributing Guide](https://github.com/Escape-Technologies/graphql-armor/blob/main/CONTRIBUTING.md) before contributing.

To setup your project, make sure you run the `install-dev.sh` script.

```bash
git clone git@github.com:Escape-Technologies/graphql-armor.git
cd graphql-armor
chmod +x ./install-dev.sh
./install-dev.sh
```

We are using yarn as our package manager. [We do use the workspaces monorepo setup](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Please read the associated documentation and feel free to open issues if you encounter problems when developing on our project!
