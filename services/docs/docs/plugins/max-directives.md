# Max Directives

**Limit** the number of **directives** in a GraphQL document.

It is used to prevent **DOS attack**, **heap overflow** or **server overloading**.

- [Configuring for GraphQL Armor](#configuring-for-graphql-armor)
- [Standalone usage](#standalone-usage)
  - [Installation](#installation)
  - [With `@graphql/graphql-js`](#with-graphqlgraphql-js)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)
- [References](#references)

## Configuring for GraphQL Armor

```ts
GraphQLArmorConfig({
  maxDirectives: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Directives threshold | default: 50
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
If you want to use the `maxDirectives` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-directives

# yarn
yarn add @escape.tech/graphql-armor-max-directives
```

### With `@graphql/graphql-js`

```ts
import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDirectivesPlugin({
        n: 50, // Number of directives allowed | Default: 50
    }),
  ]
});
```

## References

- [https://github.com/graphql-java/graphql-java/issues/2888](https://github.com/graphql-java/graphql-java/issues/2888)
- [https://github.com/graphql-java/graphql-java/pull/2892](https://github.com/graphql-java/graphql-java/pull/2892)
