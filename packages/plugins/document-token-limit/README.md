# @escape.tech/graphql-armor-document-token-limit

This plugin will limit the number of tokens in a GraphQL operation.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-document-token-limit

# yarn
yarn add @escape.tech/graphql-armor-document-token-limit
```

## Usage example

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { documentTokenLimitPlugin } from '@escape.tech/graphql-armor-document-token-limit';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    documentTokenLimitPlugin({
        maxTokenCount: 2000, // Number of tokens allowed in a document | Default: 2000
    }),
  ]
})
```

## Design considerations

This plugin relies on a parser plugin to works and access query from the context.

This should be supported by the engine you use.

If you experience any issues, please open an issue.
