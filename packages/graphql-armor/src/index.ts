import { Config as ApolloConfig, PluginDefinition } from 'apollo-server-core/src/types';
import { ValidationContext } from 'graphql';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { GraphQLArmorConfig } from './types';
import { ConfigService } from './config';

class ApolloArmor {
  private readonly _plugins: ArmorPlugin[] = [];
  private readonly _configService: ConfigService;

  constructor(config?: GraphQLArmorConfig, logger?: (message: string) => void) {
    this._configService = new ConfigService(config);

    for (const plugin of Object.values(Plugins)) {
      const pluginConfig = this._configService.getPluginConfig(plugin.name);

      if (pluginConfig.enabled) {
        this._plugins.push(new plugin(pluginConfig, logger));
      }
    }
  }

  public getPlugins(): PluginDefinition[] {
    let apolloPlugins: PluginDefinition[] = [];
    for (const plugin of this._plugins) {
      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
    }
    return apolloPlugins;
  }

  public getValidationRules(): Array<(context: ValidationContext) => any> {
    let validationRules: Array<(context: ValidationContext) => any> = [];
    for (const plugin of this._plugins) {
      validationRules = [...validationRules, ...plugin.getValidationRules()];
    }
    return validationRules;
  }

  public getConfig<T>(apolloConfig: ApolloConfig<T>): ApolloConfig<T> {
    apolloConfig.plugins ??= [];
    apolloConfig.validationRules ??= [];

    apolloConfig.plugins = [...this.getPlugins(), ...apolloConfig.plugins!];
    apolloConfig.validationRules = [...this.getValidationRules(), ...apolloConfig.validationRules!];

    return apolloConfig;
  }
}

export { ApolloArmor };
