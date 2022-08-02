import { PluginConfig } from './types';
import { ApolloArmor } from './index';
import { ValidationRule } from 'graphql';
import { PluginDefinition } from 'apollo-server-core/src/types';

export class ArmorPlugin {
  private readonly armor: ApolloArmor;
  protected readonly config: PluginConfig;

  constructor(armor: ApolloArmor, config: PluginConfig) {
    this.armor = armor;
    this.config = config;
  }

  getApolloPlugins(): PluginDefinition[] {
    return [];
  }

  getValidationRules(): ValidationRule[] {
    return [];
  }
}
