import {ApolloServerPlugin} from 'apollo-server-plugin-base';

export type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin); // apollo-server-core/src/types.ts
export type ValidationRule = any;
