# Max Tokens

**Limit** the number of **tokens** in a GraphQL document.

It is used to prevent **DOS attack**, **heap overflow** or **server overloading**.

The token limit is often limited by the graphql parser, but this is not always the case and would lead to a fatal heap overflow.

- [Max Tokens](#max-tokens)
  - [Configuring for GraphQL Armor](#configuring-for-graphql-armor)
  - [Standalone usage](#standalone-usage)
    - [Installation](#installation)
    - [With `@graphql/graphql-js`](#with-graphqlgraphql-js)
    - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)
  - [References](#references)

## Configuring for GraphQL Armor

```ts
GraphQLArmorConfig({
  maxTokens: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Tokens threshold | default: 1000
    n?: int,

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
If you want to use the `maxTokens` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-tokens

# yarn
yarn add @escape.tech/graphql-armor-max-tokens
```

### With `@graphql/graphql-js`

You can directly use the `maxTokens` option:

```ts
import { parse } from '@graphql/graphql-js';
parse('{ foo }', { maxTokens: 2 }));
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxTokensPlugin({
        maxTokenCount: 1000,
    }),
  ]
});
```

## References

- https://github.com/graphql/graphql-js/pull/3684
- https://github.com/advisories/GHSA-p4qx-6w5p-4rj2