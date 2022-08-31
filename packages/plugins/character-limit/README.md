# @escape.tech/graphql-armor-character-limit

This plugin will limit the number of character in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-character-limit

# yarn
yarn add @escape.tech/graphql-armor-character-limit
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

## Design considerations

This plugin relies on a parser plugin to works and access query from the context.

This should be supported by the engine you use.

If you experience any issues, please open an issue.
