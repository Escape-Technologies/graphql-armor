# @escape.tech/graphql-armor-max-aliases

This plugin will limit the number of aliases in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-max-aliases

# yarn
yarn add @escape.tech/graphql-armor-max-aliases
```

## Usage example

### With `@graphql/graphql-js`

```typescript
import { maxAliasesRule } from '@escape.tech/graphql-armor-max-aliases';
```

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxAliasesPlugin({
        n: 15, // Number of aliases allowed | Default: 15
    }),
  ]
})
```
