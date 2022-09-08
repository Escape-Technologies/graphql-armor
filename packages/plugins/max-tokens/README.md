# @escape.tech/graphql-armor-max-tokens

This plugin will limit the number of tokens in a GraphQL operation.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-max-tokens

# yarn
yarn add @escape.tech/graphql-armor-max-tokens
```

## Usage example

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxTokensPlugin({
        maxTokenCount: 1000, // Number of tokens allowed in a document | Default: 1000
    }),
  ]
})
```

## Design considerations

This plugin relies on a parser plugin to works and access query from the context.

This should be supported by the engine you use.

If you experience any issues, please open an issue.
