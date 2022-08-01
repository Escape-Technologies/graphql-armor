import { PluginDefinition, PluginConfig } from './types';
import { GraphQLArmor } from './index';
import { ValidationRule } from 'graphql';

export class ArmorPlugin {
  private readonly armor: GraphQLArmor;
  private readonly config: PluginConfig;

  constructor(armor: GraphQLArmor, config: PluginConfig) {
    this.armor = armor;
    this.config = config;
  }

  getConfig(): PluginConfig {
    return this.config;
  }

  getNamespace(): string {
    const _namespace = this.config._namespace;
    if (!_namespace) {
      throw new Error(`Plugin is missing a namespace`);
    }
    return _namespace;
  }

  getApolloPlugins(): PluginDefinition[] {
    return [];
  }

  getValidationRules(): ValidationRule[] {
    return [];
  }

  apolloPatchConfig(apolloConfig) {
    return apolloConfig;
  }
}
