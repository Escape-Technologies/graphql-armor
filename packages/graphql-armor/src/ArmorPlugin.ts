import { PluginConfig } from './types';
import { ApolloArmor } from './index';
import { ValidationRule } from 'graphql';
import { PluginDefinition } from 'apollo-server-core/src/types';

export class ArmorPlugin {
  private readonly _config: PluginConfig;

  constructor(config: PluginConfig) {
    this._config = config;
  }

  getConfig(): PluginConfig {
    return this._config;
  }

  getApolloPlugins(): PluginDefinition[] {
    return [];
  }

  getValidationRules(): ValidationRule[] {
    return [];
  }
}
