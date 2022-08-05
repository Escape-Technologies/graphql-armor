# @escape.tech/graphl-armor-character-limit

This plugin will limit the number of character in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphl-armor-character-limit

# yarn
yarn add @escape.tech/graphl-armor-character-limit
```

## Usage example

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { characterLimitPlugin } from '@escape.tech/graphql-armor-character-limit';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    characterLimitPlugin({
        maxLength: 15000, // Number of characters allowed | Default: 150000
    }),
  ]
})
```
