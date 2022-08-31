# @escape.tech/graphql-armor-max-depth

This plugin will limit the depth in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-max-depth

# yarn
yarn add @escape.tech/graphql-armor-max-depth
```

## Usage example

### With `@graphql/graphql-js`

```typescript
import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
```

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDepthPlugin({
        n: 6, // Number of depth allowed | Default: 6
    }),
  ]
})
```
