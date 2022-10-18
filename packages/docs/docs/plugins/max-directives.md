# Max Directives

Limit the number of directives in a GraphQL document.

## About the remediation

## Installation

:::note
If you want to use the `maxDirectives` plugin out of GraphQL Armor, you can install it from npm:
:::

```bash
# npm
npm install @escape.tech/graphql-armor-max-directives

# yarn
yarn add @escape.tech/graphql-armor-max-directives
```

## Usage

### With `@graphql/graphql-js`

```ts
import { maxDirectivesRule } from '@escape.tech/graphql-armor-max-directives';
```

### With `@envelop/core` from `@the-guild-org`

```ts
import { envelop } from '@envelop/core';
import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';

const getEnveloped = envelop({
  plugins: [
    // ... other plugins ...
    maxDirectivesPlugin({
        n: 50, // Number of directives allowed | Default: 50
    }),
  ]
});
```

## Additional configuration

> Refer to the [shared plugin configuration](../category/configuration/shared-plugin) page to view the accessible parameters exposed by GraphQL Armor core.
