# Max Depth

**Limit** the **depth** of a GraphQL document.

It is used to prevent too large queries that could lead to overfetching or **DOS attack**.

- [Configurating through GraphQL Armor](#configuring-for-graphql-armor)
- [Standalone usage](#standalone-usage)
  - [Installation](#installation)
  - [With `@graphql/graphql-js`](#with-graphqlgraphql-js)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)

## Configuring for GraphQL Armor

```ts
GraphQLArmor({
  maxDepth: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Directives threshold | default: 6
    n?: int,

    // Ignore the depth of introspection queries | default: true
    ignoreIntrospection?: boolean,

    // Callbacks that are ran whenever a Query is accepted
    onAccept?: GraphQLArmorAcceptCallback[],

    // Callbacks that are ran whenever a Query is rejected
    onReject?: GraphQLArmorRejectCallback[],

    // Do you want to propagate the rejection to the client? | default: true
    propagateOnRejection?: boolean,
  }
})
```

## Standalone usage

### Installation

:::note
If you want to use the `maxDepth` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-depth

# yarn
yarn add @escape.tech/graphql-armor-max-depth
```

### With `@graphql/graphql-js`

```ts
import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDepthPlugin({
        n: 6,
    }),
  ]
});
```
