# @escape.tech/graphql-armor-max-directives

This plugin will limit the number of directives in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-max-directives

# yarn
yarn add @escape.tech/graphql-armor-max-directives
```

## Usage example

### With `@graphql/graphql-js`

```typescript
import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';
```

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDirectivesPlugin({
        n: 50, // Number of directives allowed | Default: 50
    }),
  ]
})
```
