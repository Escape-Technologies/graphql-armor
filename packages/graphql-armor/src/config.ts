import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CharacterLimitOptions } from '@escape.tech/graphql-armor-character-limit';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';

export type ProtectionConfiguration = {
  enabled: boolean;
};

export type GraphQLArmorConfig = {
  blockFieldSuggestion?: ProtectionConfiguration & BlockFieldSuggestionsOptions;
  characterLimit?: ProtectionConfiguration & CharacterLimitOptions;
  costLimit?: ProtectionConfiguration & CostLimitOptions;
  maxAliases?: ProtectionConfiguration & MaxAliasesOptions;
  maxDepth?: ProtectionConfiguration & MaxDepthOptions;
  maxDirectives?: ProtectionConfiguration & MaxDirectivesOptions;
};
