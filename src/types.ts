import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ASTVisitor, ValidationContext } from 'graphql';
import { CharacterLimitConfig } from './plugins/CharacterLimit';
import { CostAnalysisConfig } from './plugins/CostAnalysis';
import { IntrospectionConfig } from './plugins/Introspection';

export type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin); // apollo-server-core/src/types.ts
export type ValidationRule = (context: ValidationContext) => ASTVisitor;

export type PluginConfig = {
  namespace?: string;
  enabled?: boolean;
};
export type ArmorConfig =
  | IntrospectionConfig
  | CharacterLimitConfig
  | CostAnalysisConfig;
