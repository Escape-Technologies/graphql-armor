import { ArmorPlugin } from '../ArmorPlugin';
import { PluginDefinition, ValidationRule } from '../types';

import { createComplexityLimitRule } from 'graphql-validation-complexity';

export class CharacterLimitPlugin extends ArmorPlugin {
  getValidationRules(): ValidationRule[] {
    const complexityLimitRule: ValidationRule = createComplexityLimitRule(0);

    return [complexityLimitRule];
  }
}
