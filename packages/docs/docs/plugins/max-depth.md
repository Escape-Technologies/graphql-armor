# Max Depth

Limit the depth of a GraphQL document.

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
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDepthPlugin({
        n: 6, // Number of depth allowed | Default: 6
    }),
  ]
});
```

## Additional configuration

> Refer to the [shared plugin configuration](../category/configuration/shared-plugin) page to view the accessible parameters exposed by GraphQL Armor core.
