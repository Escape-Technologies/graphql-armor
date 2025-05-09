# Block field suggestions

Prevent **returning field suggestions** and **leaking your schema** to unauthorized actors.

In production, this can lead to Schema leak even if the introspection is disabled.

- [Configuring for GraphQL Armor](#configuring-for-graphql-armor)
- [Standalone usage](#standalone-usage)
  - [Installation](#installation)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)
    - [Using the default mask](#using-the-default-mask)
    - [Using custom mask](#using-custom-mask)

## Configuring for GraphQL Armor

```ts
GraphQLArmorConfig({
  blockFieldSuggestion: {
    // Toogle the plugin | default: true
    enabled?: boolean,
    
    // Mask applied to the error message | default: '[Suggestion hidden]'
    mask?: string,
  }
})
```

## Standalone usage

### Installation

:::note
If you want to use the `blockFieldSuggestion` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-block-field-suggestions

# yarn
yarn add @escape.tech/graphql-armor-block-field-suggestions
```

### With `@envelop/core` from `@the-guild-org`

#### Using the default mask

```ts
import { envelop } from '@envelop/core';
import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestionsPlugin(),
  ]
});
```

#### Using custom mask

```ts
import { envelop } from '@envelop/core';
import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    blockFieldSuggestionsPlugin({
        mask: '<[REDACTED]>'
    }),
  ]
});
```
