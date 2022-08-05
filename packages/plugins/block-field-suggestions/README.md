# @escape.tech/graphl-armor-block-field-suggestions

This plugin will disable the suggestions in a GraphQL query.

## Getting Started

```bash
# npm
npm install @escape.tech/graphl-armor-block-field-suggestions

# yarn
yarn add @escape.tech/graphl-armor-block-field-suggestions
```

## Usage example

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestions(),
  ]
})
```
