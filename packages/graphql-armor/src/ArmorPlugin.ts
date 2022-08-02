import { PluginConfig } from './types';
import { ApolloArmor } from './index';
import { ValidationRule } from 'graphql';
import { PluginDefinition } from 'apollo-server-core/src/types';

export class ArmorPlugin {
  private readonly armor: ApolloArmor;
  private readonly config: PluginConfig;

  constructor(armor: ApolloArmor, config: PluginConfig) {
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
