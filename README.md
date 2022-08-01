# 🛡️ GraphQL-Armor 🛡️

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![CD](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/cd.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor)

🛡️ GraphQL-Armor 🛡️ is a Dead-simple, yet highly customizable security middleware for [Apollo GraphQL](https://github.com/apollographql/apollo-server) servers.

## Contents

* [Supported Remediations](#supported-remediations)
* [Installation](#installation)
* [API](#api)
* [Examples](#examples)
  * [Apollo Server](#apollo-server)
  * [NestJS](#nestjs)
  * [Others](#others)
* [Configuration](#configuration)
* [Environment Variables](#environment-variables)
* [Events](#events)

## Supported remediations

### Remediations enabled by default

* [Character Limit](#character-limit)
* [Limit Query Cost](#cost-analysis)
* [Disable Introspection](#block-introspection)
* [Disable Field Suggestion](#field-suggestion)

## Installation

```bash
# npm
npm install @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

## API

```typescript
import { GQLArmor } from '@escape.tech/graphql-armor';

GQLArmor(
    // Optional:
    // If you want to use a custom configuration, you can pass it in here.
    config?: GQLArmorConfig,

    // Optional:
    // If you want to catch the plugin updates, you can pass a callback.
    onPluginUpdate?: PluginUpdateEvent,
)

GQLArmor.getPlugins()
=> PluginDefinition[]

GQLArmor.getValidationRules()
=> ValidationRule[]

GQLArmor.getConfig<ContextFunctionParams>(
    apolloConfig: Config<ContextFunctionParams>
): Config<ContextFunctionParams>

GQLArmor.apolloServer(
    apolloConfig: Config<ContextFunctionParams>
): ApolloServer<ContextFunctionParams>
```

```typescript
import { ArmoredConfig, ArmoredConfigU } from '@escape.tech/graphql-armor';

/**
 * Armored Config
 * @description
 * This will inject remediations into the config.
 * @param apolloConfig The ApolloConfig object
 * @param armorConfig  The GQLArmorConfig object
 * @param onPluginUpdate  The function to call when a plugin is updated
 * @returns The configuration object with the remediation injected
 */
ArmoredConfig(
    apolloConfig: Config<ContextFunctionParams>,
    armorConfig?: GQLArmorConfig,
)

/**
 *  Armored Config Unsafe
 *  @description
 *  This is a wrapper around the `ArmoredConfig` function.
 *  It is used to create a config that is safe to use in a production environment.
 *  @param config We except an object with the same shape as the `ApolloConfig` object.
 *                ie: `validationRules`, `plugins`, ...properties
 *  @returns The remediated object after injection.
 **/
ArmoredConfigU(
    config: {
        validationRules: ValidationRule[],
        plugins: PluginDefinition[],
        ...
    },
) -> config{...}
```

## Examples

### Apollo Server

#### Applying remediation from GraphQL-Armor

```typescript
import { GQLArmor } from '@escape.tech/graphql-armor';
const armor = new GQLArmor({});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [...armor.getPlugins(), ...yourPlugins],
  validationRules: [...armor.getValidationRules(), ...yourValidationRules],
});
```

#### Patching the configuration through GraphQL-Armor

```typescript
import { ArmoredConfig } from '@escape.tech/graphql-armor';

const server = new ApolloServer(ArmoredConfig({
  typeDefs,
  resolvers,
  cache: 'bounded',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
}))
```

#### Instanciating ApolloServer from GraphQL-Armor

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

### NestJS

#### Applying remediation from GraphQL-Armor

```typescript
import { GQLArmor } from '@escape.tech/graphql-armor';

@Module({
  imports: [
    GraphQLModule.forRoot({
      ...

      // Prepend the remediations directly to the configuration properties
      validationRules: [...armor.getValidationRules(), ...yourRules],
      plugins: [...armor.getPlugins(), ...yourPlugins],
    }),
  ],
})
```

#### Wrapping factory with GraphQL-Armor

```typescript
import { ArmoredConfig } from '@escape.tech/graphql-armor';

@Module({
  imports: [
    GraphQLModule.forRoot({
      ...

      useFactory() => {
        return ArmoredConfig({
          // Prepend the remediations directly to the configuration properties
          validationRules: [yourRules],
          plugins: [yourPlugins],
        });
      }
    }),
  ],
})
```

#### Patching factory with GraphQL-Armor

```typescript
import { GQLArmor } from '@escape.tech/graphql-armor';

const armor = new GQLArmor({});

@Module({
  imports: [
    GraphQLModule.forRoot({
      ...

      useFactory() => {
        return {
          // Prepend the remediations directly to the configuration properties
          validationRules: [armor.getValidationRules(), yourRules],
          plugins: [armor.getPlugins(), yourPlugins],
        };
      }
    }),
  ],
})
```

### Others

#### Inheritence from Apollo Config

```typescript
import { ArmoredConfig } from '@escape.tech/graphql-armor';

const config = ArmoredConfig({
  plugins: [...yourPlugins],
  validationRules: [...yourRules]
});
```

#### Others types

```typescript
import { ArmoredConfigU } from '@escape.tech/graphql-armor';

const config = ArmoredConfigU({
  plugins: [...yourPlugins],
  validationRules: [...yourRules]
});
```

## Configuration

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
|Field Suggestion|  0x8|

For example, if you want to toggle `ONLY` the `Character Limit` and `Cost Analysis` remediations, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSIONS=$(python -c "print(0x1 | 0x2)") # Toggle only:  Character Limit and Cost Analysis plugin
```

If you want to toggle `ONLY` the `Introspection` remediation, you can use the following environment variable:

```bash
export GQLARMOR_PERMISSIONS=$(python -c "print(0x4)") # Toggle only: Introspection plugin
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
