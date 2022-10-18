# Max Aliases

Limit the number of aliases in a GraphQL document.

## About the remediation

## Installation

:::note
If you want to use the `maxAliases` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-aliases

# yarn
yarn add @escape.tech/graphql-armor-max-aliases
```

## Usage

### With `@graphql/graphql-js`

```ts
import { maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxAliasesPlugin({
        n: 15, // Number of aliases allowed | Default: 15
    }),
  ]
});
```

## Additional configuration

> Refer to the [shared plugin configuration](../category/configuration/shared-plugin) page to view the accessible parameters exposed by GraphQL Armor core.
