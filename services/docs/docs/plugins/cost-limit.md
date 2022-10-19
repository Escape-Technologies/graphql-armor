# Cost limit

**Limit** the **complexity** of a GraphQL document.

- [Configurating through GraphQL Armor](#configuring-for-graphql-armor)
- [Standalone usage](#standalone-usage)
  - [Installation](#installation)
  - [With `@graphql/graphql-js`](#with-graphqlgraphql-js)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)

## Configuring for GraphQL Armor

```ts
GraphQLArmor({
  maxAliases: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Cost allowed | default: 5000
    maxCost?: int,

    // Static cost of an object | default: 2
    objectCost?: int,

    // Static cost of a field | default: 1
    scalarCost?: int,

    // Factorial applied to nested operator | default: 1.5
    depthCostFactor?: int,

    // Ignore the cost of introspection queries | default: true
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
If you want to use the `costLimit` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-cost-limit

# yarn
yarn add @escape.tech/graphql-armor-cost-limit
```

### With `@graphql/graphql-js`

```ts
import { costLimitRule } from '@escape.tech/graphql-armor-cost-limit';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    costLimitPlugin({
        maxCost: 5000,              // Default: 5000
        objectCost: 2,              // Default: 2
        scalarCost: 1,              // Default: 1
        depthCostFactor: 1.5,       // Default: 1.5
        ignoreIntrospection: true,  // Default: true
    }),
  ]
});
```
