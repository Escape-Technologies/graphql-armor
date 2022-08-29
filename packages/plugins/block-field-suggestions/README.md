# @escape.tech/graphql-armor-block-field-suggestions

This plugin will disable the suggestions in a GraphQL query.

GraphQL suggestions are messages (Did you mean ...) that help you adjusting your query.

This can lead to a Schema leak even if the introspection is disabled.

## Getting Started

```bash
# npm
npm install @escape.tech/graphql-armor-block-field-suggestions

# yarn
yarn add @escape.tech/graphql-armor-block-field-suggestions
```

## Usage example default

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

## Usage example with custom mask

### With `@envelop/core` from `@the-guild-org`

```typescript
import { envelop } from '@envelop/core';
import { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestions({
        mask: '<[REDACTED]>'
    }),
  ]
})
```
