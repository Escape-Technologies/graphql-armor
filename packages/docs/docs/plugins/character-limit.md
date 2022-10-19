# Character Limit

**Limit** number of **characters** in a GraphQL document.

This help preventing **DoS attacks** by limiting the size of the document.

- [Installation](#installation)
- [Usage](#usage)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)
- [Design decisions](#design-decisions)

:::caution Out of core
This plugin is not part of the core package, you need to install it separately.
:::

## Installation

```bash
# npm
npm install @escape.tech/graphql-armor-character-limit

# yarn
yarn add @escape.tech/graphql-armor-character-limit
```

## Usage

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { characterLimitPlugin } from '@escape.tech/graphql-armor-character-limit';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    characterLimitPlugin({
        maxLength: 15000, // Number of characters allowed | Default: 15000
    }),
  ]
});
```

## Design decisions

This plugin relies on a parser plugin to works and access query from the context.

This should be supported by the engine you use.

If you experience any issues, please open an issue.
