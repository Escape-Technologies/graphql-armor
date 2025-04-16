# Max Aliases

**Limit** the number of **aliases** in a GraphQL document.

It is used to prevent **DOS attack** or **heap overflow**.

- [Configuring for GraphQL Armor](#configuring-for-graphql-armor)
- [Standalone usage](#standalone-usage)
  - [Installation](#installation)
  - [With `@graphql/graphql-js`](#with-graphqlgraphql-js)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)

## Configuring for GraphQL Armor

```ts
GraphQLArmorConfig({
  maxAliases: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Aliases threshold | default: 15
    n?: int,

    // Callbacks that are ran whenever a Query is accepted
    onAccept?: GraphQLArmorAcceptCallback[],

    // Callbacks that are ran whenever a Query is rejected
    onReject?: GraphQLArmorRejectCallback[],

    // Do you want to propagate the rejection to the client? | default: true
    propagateOnRejection?: boolean,

    // List of queries that are allowed to bypass the plugin | default: ['__typename']
    allowList?: string[],
  }
})
```

## Standalone usage

### Installation

:::note
If you want to use the `maxAliases` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-aliases

# yarn
yarn add @escape.tech/graphql-armor-max-aliases
```

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
