import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ASTVisitor, ValidationContext } from 'graphql';

export type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin); // apollo-server-core/src/types.ts
export type ValidationRule = (context: ValidationContext) => ASTVisitor;
