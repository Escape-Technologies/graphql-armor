# Block field suggestions

Prevent returning field suggestions and leaking your schema to unauthorized actors.

## About the remediation

This plugin will disable the suggestions thrown by a GraphQL query.

GraphQL suggestions are messages (`.. Did you mean ...`) that help you adjusting your query, correcting the typos and so on.

In production, this can lead to a Schema leak even if the introspection is disabled.

## Installation

:::note
If you want to use the `blockFieldSuggestions` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-block-field-suggestions

# yarn
yarn add @escape.tech/graphql-armor-block-field-suggestions
```

## Usage

### With `@envelop/core` from `@the-guild-org`

#### Using the default mask

```ts
import { envelop } from '@envelop/core';
import { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestions(),
  ]
});
```

#### Using custom mask for the error

```ts
import { envelop } from '@envelop/core';
import { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestions({
        mask: '<[REDACTED]>'
    }),
  ]
});
```
