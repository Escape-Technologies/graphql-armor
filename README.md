# 🛡️ GraphQL-Armor 🛡️

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![CD](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor)

🛡️ GraphQL-Armor 🛡️ is a Dead-simple, yet highly customizable security middleware for [Apollo GraphQL](https://github.com/apollographql/apollo-server) servers.

## Contents

- [🛡️ GraphQL-Armor 🛡️](#️-graphql-armor-️)
  - [Contents](#contents)
  - [Supported remediations](#supported-remediations)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
  - [Getting Started with Configuration](#getting-started-with-configuration)
  - [Per plugin remediation](#per-plugin-remediation)
    - [Character Limit](#character-limit)
    - [Cost Analysis](#cost-analysis)
    - [Block Introspection](#block-introspection)
    - [Field Suggestion](#field-suggestion)
  - [Configuration](#configuration)
  - [API](#api)
  - [Environment Variables](#environment-variables)
    - [Permissions](#permissions)

## Supported remediations

- [Character Limit](#character-limit)
- [Limit Query Cost](#cost-analysis)
- [Disable Introspection](#block-introspection)
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
  plugins: [...armor.getApolloPlugins(), ...yourPlugins],
  validationRules: [...armor.getApolloValidationRules(), ...yourValidationRules],
});
```

## Getting Started with Configuration

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
    CostAnalysis: {
        enabled: true,
        options: {
            maxCost: 1000, // Default: 1000
        },
    }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [...armor.getApolloPlugins(), ...yourPlugins],
  validationRules: [...armor.getApolloValidationRules(), ...yourValidationRules],
});
```

## Per plugin remediation

### Character Limit

`Character Limit plugin` will enforce a character limit on your GraphQL queries.

(Note: The limit is not applied to whole HTTP body -, multipart form data / file upload will still works)

```typescript
{
    CharacterLimit: {
        enabled: true,
        options: {
            maxLength: 15000, // Default: 15000
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

### Block Introspection

`BlockIntrospection plugin` will prevent introspection queries from being executed.

By default, introspection is still available for our [Live GraphQL Security Testing Platform](https://escape.tech) by providing a valid identifier.

```typescript
{
    BlockIntrospection: {
        enabled: false,
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

## Configuration

## API

```typescript
import { ApolloArmor } from '@escape.tech/graphql-armor';

ApolloArmor(
    // Optional:
    // If you want to use a custom configuration, you can pass it in here.
    config?: GraphQLArmorConfig,
)

ApolloArmor.getPlugins()
=> PluginDefinition[]

ApolloArmor.getValidationRules()
=> ValidationRule[]

ApolloArmor.getConfig<T>(
    apolloConfig: Config<T>
): Config<T>
```

```typescript
import { ArmorApolloConfig, ArmorApolloConfigU } from '@escape.tech/graphql-armor';

/**
 * Armored Config
 * @description
 * This will inject remediations into the config.
 * @param apolloConfig The ApolloConfig object
 * @param armorConfig  The GraphQLArmorConfig object
 * @returns The configuration object with the remediation injected
 */
ArmorApolloConfig(
    apolloConfig: Config<T>,
    armorConfig?: GraphQLArmorConfig,
)

/**
 *  Armored Config Unsafe
 *  @description
 *  This is a wrapper around the `ArmorApolloConfig` function.
 *  It is used to create a config that is safe to use in a production environment.
 *  @param config We except an object with the same shape as the `ApolloConfig` object.
 *                ie: `validationRules`, `plugins`, ...properties
 *  @returns The remediated object after injection.
 **/
ArmorApolloConfigU(
    config: {
        validationRules: ValidationRule[],
        plugins: PluginDefinition[],
        ...
    },
) -> config{...}
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
|Field Suggestion|  0x8|

For example, if you want to toggle `ONLY` the `Character Limit` and `Cost Analysis` remediations, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSIONS=$(python -c "print(0x1 | 0x2)") # Toggle only:  Character Limit and Cost Analysis plugin
```

If you want to toggle `ONLY` the `Introspection` remediation, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSIONS=$(python -c "print(0x4)") # Toggle only: Introspection plugin
```
