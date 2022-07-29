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

  getNamespace() {
    return this.config.namespace;
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
