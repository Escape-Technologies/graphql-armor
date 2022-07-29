# 🛡️ GraphQL-Armor 🛡️

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![CD](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor)

🛡️ GraphQL-Armor 🛡️ is a Dead-simple, yet highly customizable security middleware for [Apollo GraphQL](https://github.com/apollographql/apollo-server) servers.

## Supported remediations

### Remediations enabled by default

- [Character Limit](#character-limit)
- [Limit Query Cost](#cost-analysis)
- [Disable Introspection](#introspection)
- [Disable Field Suggestion](#field-suggestion)


## Installation

```bash
# npm
npm install @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

## Usage

```typescript
import { GQLArmor } from '@escape.tech/graphql-armor';

const armor = new GQLArmor({});

const server = armor.apolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
```

## Configuration

GQLArmor supports the following configuration options:

```typescript
GQLArmor(
    // Optional:
    // If you want to use a custom configuration, you can pass it in here.
    config?: GQLArmorConfig,

    // Optional:
    // If you want to catch the plugin updates, you can pass a callback.
    onPluginUpdate?: (plugin: PluginUpdateEvent) => void,
)
```

Goto [Events/onPluginUpdate](#onpluginupdate) for more information.

### Character Limit

`Character Limit plugin` will enforce a character limit on your GraphQL queries.

(Note: The limit is not applied to whole HTTP body -, multipart form data / file upload will still works)

```typescript
{
    CharacterLimit: {
        enabled: true,
        options: {
            maxLength: 3000, // Default: 3000
        },
    }
}
```

### Cost Analysis

`Cost Analysis plugin` analyze incoming GraphQL queries and apply cost analysis algorithm to prevent resource overload.

```typescript
{
    CostAnalysis: {
        enabled: true,
        options: {
            maxCost: 1000, // Default: 1000
        },
    }
}
```

### Introspection

`Introspection plugin` will prevent introspection queries from being executed.

By default, introspection is still available for our [Live GraphQL Security Testing Platform](https://escape.tech) by providing a valid identifier.

```typescript
{
    Introspection: {
        enabled: true,
        options: {
            headersWhitelist: {
                'x-allow-introspection': 'allow',
                ...(process.env.ESCAPE_IDENTIFIER ? { 'x-escape-identifier': process.env.ESCAPE_IDENTIFIER } : {}),
            },
        },
    }
}
```

### Field Suggestion

`Field Suggestion plugin` will prevent suggesting fields of unprecise GraphQL queries.

```typescript
{
    FieldSuggestion: {
        enabled: true,
    }
}
```

## Environment Variables

### Permissions

GraphQL-Armor support toggling remediations via environment variables.

We use a bitwise operation to switch the remediation on and off, this way, you can toggle multiple remediations using one variable.

```bash
export GQLARMOR_PERMISSIONS=-1 # Do not infer configuration
export GQLARMOR_PERMISSIONS=0  # Disable every remediations
```

|    Remediation|  Bit|
|:-------------:|:---:|
|Character Limit|  0x1|
|  Cost Analysis|  0x2|
|  Introspection|  0x4|
|FieldSuggestion|  0x8|

For example, if you want to toggle `ONLY` the `Character Limit` and `Cost Analysis` remediations, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSION=$(python -c "print(0x1 | 0x2)") # Toggle only:  Character Limit and Cost Analysis plugin
```

If you want to toggle `ONLY` the `Introspection` remediation, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSION=$(python -c "print(0x4)") # Toggle only: Introspection plugin
```

## Events

### onPluginUpdate

```typescript
export type PluginUpdateEvent = (status: PluginState, plugin: PluginConfig) => void;
export enum PluginState {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  REGISTERED = 'registered',
  UNREGISTERED = 'unregistered',
}
```
