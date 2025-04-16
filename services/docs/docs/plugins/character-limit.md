# Character Limit

**Limit** number of **characters** in a GraphQL query document.

This help preventing **DoS attacks** by hard-limiting the size of the query document.

- [Installation](#installation)
- [Usage](#usage)
  - [With `@envelop/core` from `@the-guild-org`](#with-envelopcore-from-the-guild-org)
- [Design considerations](#design-considerations)

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

## Design considerations

- We recommend using the max-tokens plugin instead of this one.
- This plugin is not part of the core package as your engine may provide such feature.
- This plugin does not limit the size of input variables.
- This plugin relies on a parser plugin to works and access query document through the context.
