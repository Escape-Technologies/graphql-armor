import { PluginConfig } from './types';
import { ValidationRule } from 'graphql';
import { PluginDefinition } from 'apollo-server-core/src/types';
// import { Plugin } from '@envelop/core';

export class ArmorPlugin {
  private readonly _config: PluginConfig;
  private readonly _logger: null | ((message: string) => void);

  constructor(config: PluginConfig, logger: null | ((message: string) => void) = null) {
    this._config = config;
    this._logger = logger;
  }

  log(message: string) {
    if (this._logger) this._logger(message);
  }

  getConfig(): PluginConfig {
    return this._config;
  }

  getApolloPlugins(): PluginDefinition[] {
    return [];
  }

  // getEnvelopPlugins(): Plugin[] {
  //   return [];
  // }

  getValidationRules(): ValidationRule[] {
    return [];
  }
}
