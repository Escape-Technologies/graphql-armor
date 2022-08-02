import { Config as ApolloConfig, PluginDefinition } from 'apollo-server-core/src/types';
import { ValidationContext } from 'graphql';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { GraphQLArmorConfig } from './types';
import { ConfigService } from './config';

/**
 * Armored Config
 * @description
 * This will inject remediations into the config.
 * @param apolloConfig The ApolloConfig object
 * @param armorConfig  The GraphQLArmorConfig object
 * @returns The configuration object with the remediation injected
 */
function ArmorApolloConfig<T>(apolloConfig: ApolloConfig<T>, armorConfig?: GraphQLArmorConfig): ApolloConfig<T> {
  const service = new ApolloArmor(armorConfig);
  return service.getConfig(apolloConfig);
}

/**
 *  Armored Config Unsafe
 *  @description
 *  This is a wrapper around the `ArmorApolloConfig` function.
 *  It is used to create a config that is safe to use in a production environment.
 *  @param config We except an object with the same shape as the `ApolloConfig` object.
 *                ie: `validationRules`, `plugins`, ...properties
 *  @returns The configuration object with the remediation injected.
 **/
function ArmorApolloConfigU(config: any): any {
  const service = new ApolloArmor();
  return service.getConfig(config);
}

class ApolloArmor {
  private readonly _plugins: ArmorPlugin[] = [];
  private readonly _configService: ConfigService;

  constructor(config?: GraphQLArmorConfig) {
    this._configService = new ConfigService(config);

    for (const plugin of Object.values(Plugins)) {
      const pluginConfig = this._configService.getPluginConfig(plugin.name);

      if (pluginConfig.enabled) {
        this._plugins.push(new plugin(this, pluginConfig));
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

export { ApolloArmor, ArmorApolloConfig, ArmorApolloConfigU };
