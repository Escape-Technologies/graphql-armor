import { ApolloServer } from 'apollo-server-express';
import { Config } from 'apollo-server-core/src/types';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { PluginDefinition, ValidationRule, GraphQLArmorConfig, PluginUpdateEvent, PluginState } from './types';
import { ConfigService } from './config';

/**
 * Armored Config
 * @description
 * This will inject remediations into the config.
 * @param apolloConfig The ApolloConfig object
 * @param armorConfig  The GraphQLArmorConfig object
 * @param onPluginUpdate  The function to call when a plugin is updated
 * @returns The configuration object with the remediation injected
 */
function ArmorApolloConfig<T>(
  apolloConfig: Config<T>,
  armorConfig?: GraphQLArmorConfig,
  onPluginUpdate?: PluginUpdateEvent,
): Config<T> {
  const service = new GraphQLArmor(armorConfig, onPluginUpdate);
  return service.getApolloConfig(apolloConfig);
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
  const service = new GraphQLArmor();
  return service.getApolloConfig(config);
}

class GraphQLArmor {
  private readonly _plugins: ArmorPlugin[] = [];
  private readonly _configService: ConfigService;
  private readonly _onPluginUpdate?: PluginUpdateEvent;

  /*
   * Push each plugin to the plugins array
   */
  constructor(config?: GraphQLArmorConfig, onPluginUpdate?: PluginUpdateEvent) {
    this._configService = new ConfigService(config);
    this._onPluginUpdate = onPluginUpdate;

    for (const plugin of Object.values(Plugins)) {
      const pluginConfig = this._configService.getPluginConfig(plugin.name);

      if (pluginConfig.enabled) {
        this._plugins.push(new plugin(this, pluginConfig));

        // Spread the plugin registration event
        if (this._onPluginUpdate) {
          this._onPluginUpdate(PluginState.REGISTERED, pluginConfig);
        }
      }
    }
  }

  public getApolloPlugins(): PluginDefinition[] {
    let apolloPlugins: PluginDefinition[] = [];
    for (const plugin of this._plugins) {
      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
    }
    return apolloPlugins;
  }

  public getApolloValidationRules(): ValidationRule[] {
    let validationRules: ValidationRule[] = [];
    for (const plugin of this._plugins) {
      validationRules = [...validationRules, ...plugin.getValidationRules()];
    }
    return validationRules;
  }

  public getApolloConfig<T>(apolloConfig: Config<T>): Config<T> {
    apolloConfig.plugins ??= [];
    apolloConfig.validationRules ??= [];

    for (const plugin of this._plugins) {
      apolloConfig = plugin.apolloPatchConfig(apolloConfig);
    }

    apolloConfig.plugins = [...this.getApolloPlugins(), ...apolloConfig.plugins!];
    apolloConfig.validationRules = [...this.getApolloValidationRules(), ...apolloConfig.validationRules!];

    return apolloConfig;
  }

  public patchApolloServer<T>(apolloConfig: Config<T>): ApolloServer<T> {
    return new ApolloServer<T>(this.getApolloConfig(apolloConfig));
  }
}

export { GraphQLArmor, ArmorApolloConfig, ArmorApolloConfigU };
