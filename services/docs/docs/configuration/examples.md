# Examples

Straightforward examples of how to configure GraphQL Armor.

- [Make GraphQL Armor inoffensive](#make-graphql-armor-inoffensive)
- [Observe rejected requests](#observe-rejected-requests)

## Make GraphQL Armor inoffensive

GraphQL Armor behavior can be configured to be **inoffensive**. This means that it will **not block any requests**, but it will still process your callbacks.

Currently, there is no global parameter but a **per-plugin parameter**.

Here is an example to set **every plugin** to be **inoffensive**:

```ts
GraphQLArmor({
  costLimit: {
    propagateOnRejection: false,
  },
  maxAliases: {
    propagateOnRejection: false,
  },
  maxDepth: {
    propagateOnRejection: false,
  },
  maxDirectives: {
    propagateOnRejection: false,
  },
  maxTokens: {
    propagateOnRejection: false,
  }
})
```

## Observe rejected requests

GraphQL Armor is made to be fully observable.

We provide two callbacks to observe the **rejected requests**:

- `onAccept`: called when a request is accepted by a plugin
- `onReject`: called when a request is rejected by a plugin

Here is an example if you want to log every rejected request:

```ts
import type { GraphQLError, ValidationContext } from 'graphql';

const logRejection = (ctx: ValidationContext | null, error: GraphQLError) => {
    if (ctx) {
        console.log(`rejection context: ${ctx}`)
    }
    console.log(`rejected request: ${error}`)
}

GraphQLArmor({
  costLimit: {
    onReject: [logRejection]
  },
  maxAliases: {
    onReject: [logRejection]
  },
  maxDepth: {
    onReject: [logRejection]
  },
  maxDirectives: {
    onReject: [logRejection]
  },
  maxTokens: {
    onReject: [logRejection]
  }
})
```
