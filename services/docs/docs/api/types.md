# Types

## Callbacks

### GraphQLArmorAcceptCallback

```ts
import type { ValidationContext } from 'graphql';

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;
```

### GraphQLArmorRejectCallback

```ts
import type { GraphQLError, ValidationContext } from 'graphql';

export type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;
```
