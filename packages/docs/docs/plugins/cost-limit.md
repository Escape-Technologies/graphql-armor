# Cost limit

Limit the complexity of a GraphQL document.

## About the remediation

## Installation

:::note
If you want to use the `costLimit` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-cost-limit

# yarn
yarn add @escape.tech/graphql-armor-cost-limit
```

## Usage

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

## Additional configuration

> Refer to the [shared plugin configuration](../category/configuration/shared-plugin) page to view the accessible parameters exposed by GraphQL Armor core.
