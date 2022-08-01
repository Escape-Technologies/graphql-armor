import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ASTVisitor, ValidationContext } from 'graphql';
import { BlockFieldSuggestionConfig } from 'plugins/BlockFieldSuggestion';
import { CharacterLimitConfig } from './plugins/CharacterLimit';
import { CostAnalysisConfig } from './plugins/CostAnalysis';
import { BlockIntrospectionConfig } from './plugins/BlockIntrospection';

export type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin); // apollo-server-core/src/types.ts
export type ValidationRule = (context: ValidationContext) => ASTVisitor;

// Plugin Event
export enum PluginState {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  REGISTERED = 'registered',
  UNREGISTERED = 'unregistered',
}
export type PluginUpdateEvent = (status: PluginState, plugin: PluginConfig) => void;

// Config
export type PluginConfig = {
  _namespace?: string;
  enabled?: boolean;
  options?: any;
};

export type GQLArmorConfig =
  | BlockIntrospectionConfig
  | CharacterLimitConfig
  | CostAnalysisConfig
  | BlockFieldSuggestionConfig;
