import type { BlockFieldSuggestionsOptions } from '@escape.tech/graphql-armor-block-field-suggestions';
import type { CostLimitOptions } from '@escape.tech/graphql-armor-cost-limit';
import type { MaxAliasesOptions } from '@escape.tech/graphql-armor-max-aliases';
import type { MaxDepthOptions } from '@escape.tech/graphql-armor-max-depth';
import type { MaxDirectivesOptions } from '@escape.tech/graphql-armor-max-directives';
import type { MaxTokensOptions } from '@escape.tech/graphql-armor-max-tokens';
import { GraphQLArmorParseConfiguration, GraphQLArmorValidateConfiguration } from '@escape.tech/graphql-armor-types';

export type GraphQLArmorConfig<PluginContext extends Record<string, unknown> = {}> = {
  blockFieldSuggestion?: GraphQLArmorValidateConfiguration<PluginContext> & BlockFieldSuggestionsOptions;
  costLimit?: GraphQLArmorValidateConfiguration<PluginContext> & CostLimitOptions;
  maxAliases?: GraphQLArmorValidateConfiguration<PluginContext> & MaxAliasesOptions;
  maxDepth?: GraphQLArmorValidateConfiguration<PluginContext> & MaxDepthOptions;
  maxDirectives?: GraphQLArmorValidateConfiguration<PluginContext> & MaxDirectivesOptions;
  maxTokens?: GraphQLArmorParseConfiguration<PluginContext> & MaxTokensOptions;
};
