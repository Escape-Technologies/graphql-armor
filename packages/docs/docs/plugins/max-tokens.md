# Max Tokens

Limit the number of tokens in a GraphQL document.

## About the remediation

## Installation

:::note
If you want to use the `maxDepth` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-depth

# yarn
yarn add @escape.tech/graphql-armor-max-depth
```

## Usage

### With `@graphql/graphql-js`

```ts
import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxTokensPlugin({
        maxTokenCount: 1000, // Number of tokens allowed in a document | Default: 1000
    }),
  ]
});
```

## Additional configuration

> Refer to the [shared plugin configuration](../category/configuration/shared-plugin) page to view the accessible parameters exposed by GraphQL Armor core.
