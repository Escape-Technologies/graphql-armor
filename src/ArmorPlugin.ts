import {PluginDefinition, ValidationRule} from './types';
import {Armor} from './index';

export class ArmorPlugin {
  private armor: Armor;

  constructor(armor: Armor) {
    this.armor = armor;
  }

  getApolloPlugins(): PluginDefinition[] {
    return [];
  }

  getValidationRules(): ValidationRule[] {
    return [];
  }

  apolloPatchConfig(config) {
    return config;
  }
}
