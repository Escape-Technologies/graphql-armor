import { PluginDefinition, PluginConfig } from './types';
import { GQLArmor } from './index';
import { ValidationRule } from 'graphql';

export class ArmorPlugin {
  private readonly armor: GQLArmor;
  private readonly config: PluginConfig;

  constructor(armor: GQLArmor, config: PluginConfig) {
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
