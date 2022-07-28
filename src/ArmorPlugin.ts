import { PluginDefinition } from './types';
import { GQLArmor } from './index';
import { ValidationRule } from 'graphql';

export class ArmorPlugin {
  private armor: GQLArmor;

  constructor(armor: GQLArmor) {
    this.armor = armor;
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
