import { PluginConfig } from './types';
import { ValidationRule } from 'graphql';
import { PluginDefinition } from 'apollo-server-core/src/types';
// import { Plugin } from '@envelop/core';

export class ArmorPlugin {
  private readonly _config: PluginConfig;
  private readonly _logger?: (message: string) => void;

  constructor(config: PluginConfig, logger?: (message: string) => void) {
    this._config = config;
    this._logger = logger;
  }

  log(message: string) {
    if (this._logger) {
      this._logger(message);
    }
  }

  getConfig(): PluginConfig {
    return this._config;
  }

  getApolloPlugins(): ApolloPlugin[] {
    return [];
  }

  getEnvelopPlugins(): EnvelopPlugin[] {
    return [];
  }

  // getEnvelopPlugins(): Plugin[] {
  //   return [];
  // }

  getValidationRules(): ValidationRule[] {
    return [];
  }
}
