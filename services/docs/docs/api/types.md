# Types

Import types to configure GraphQL Armor from the `@escape.tech/graphql-armor-types` package or each [plugin](../category/plugins/) individually.

## Config

The complete set of [configuration options](#plugins) is available in the `GraphQLArmorConfig` type and can be imported from the `@escape.tech/graphql-armor-types` package:

```ts
export type ProtectionConfiguration = {
  enabled?: boolean;
};

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration & BlockFieldSuggestionsOptions;
  costLimit?: ProtectionConfiguration & CostLimitOptions;
  maxAliases?: ProtectionConfiguration & MaxAliasesOptions;
  maxDepth?: ProtectionConfiguration & MaxDepthOptions;
  maxDirectives?: ProtectionConfiguration & MaxDirectivesOptions;
  maxTokens?: ProtectionConfiguration & MaxTokensOptions;
};
```

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

## Plugins

Types to [configure](../category/configuration) each of the plugins are available from their respective packages and are used in `GraphQLArmorConfig`:

```ts
import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';
import type { MaxTokensOptions } from '@escape.tech/graphql-armor-max-tokens';
import type { GraphQLError, ValidationContext } from 'graphql';
```
