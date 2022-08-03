# GraphQL Armor 🛡️

*This project is young so there might be bugs but we are very reactive so feel free to open issues.*

GraphQL Armor is a Dead-simple, yet highly customizable security middleware for [Apollo GraphQL](https://github.com/apollographql/apollo-server) servers.

![GraphQL-Armor banner](https://raw.githubusercontent.com/Escape-Technologies/graphql-armor/main/packages/docs/banner.png)

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![CD](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor)

## Contents

- [GraphQL Armor 🛡️](#graphql-armor-️)
  - [Contents](#contents)
  - [Supported remediations](#supported-remediations)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
  - [Getting Started with Configuration](#getting-started-with-configuration)
  - [Per plugin remediation](#per-plugin-remediation)
    - [Character Limit](#character-limit)
    - [Cost Analysis](#cost-analysis)
    - [Field Suggestion](#field-suggestion)
  - [Contributing](#contributing)

## Supported remediations

- [Character Limit](#character-limit)
- [Limit Query Cost](#cost-analysis)
- [Disable Field Suggestion](#field-suggestion)

## Installation

```bash
# npm
npm install @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

## Getting Started

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';
const armor = new ApolloArmor({
    // Config opts
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [...armor.getPlugins(), ...yourPlugins],
  validationRules: [...armor.getValidationRules(), ...yourValidationRules],
});
```

## Getting Started with Configuration

GraphQL-Armor is fully configurable, scoped per plugin.

View the [Per plugin remediation](#per-plugin-remediation) section for more information.

Refer to the [Examples directory](https://github.com/Escape-Technologies/graphql-armor/tree/main/examples) for specific implementation.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    CostAnalysis: {
        enabled: true,
        options: {
            maxCost: 1000,
        },
    }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [...armor.getPlugins(), ...yourPlugins],
  validationRules: [...armor.getValidationRules(), ...yourValidationRules],
});
```

## Per plugin remediation

This section describes how to configure each plugin individually.

### Character Limit

`Character Limit plugin` will enforce a character limit on your GraphQL queries.

(Note: The limit is not applied to whole HTTP body -, multipart form data / file upload will still works)

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

`Cost Analysis plugin` analyze incoming GraphQL queries and apply cost analysis algorithm to prevent resource overload.

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

`Field Suggestion plugin` will prevent suggesting fields of unprecise GraphQL queries.

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    fieldSuggestion: {
        enabled: true,
    }
});
```

## Contributing

Ensure you have read the [Contributing Guide](https://github.com/Escape-Technologies/graphql-armor/blob/main/CONTRIBUTING.md) before contributing.

To setup your project, make sure you run `install-dev.sh` script.

```bash
git clone git@github.com:Escape-Technologies/graphql-armor.git
cd graphql-armor
chmod +x ./install-dev.sh
./install-dev.sh
```

We are using yarn as our package manager.

You will be able to run command from the root using `yarn workspace @escape.tech/pkg cmd`.
