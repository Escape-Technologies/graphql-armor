# @escape.tech/graphql-armor-cost-limit

This plugin will limit the cost of a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-cost-limit

# yarn
yarn add @escape.tech/graphql-armor-cost-limit
```

## Usage example

### With `@graphql/graphql-js`

```typescript
import { costLimitRule } from '@escape.tech/graphql-armor-cost-limit';
```

### With `@envelop/core` from `@the-guild-org`

```typescript
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
})
```
