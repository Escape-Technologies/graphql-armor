import { ApolloServer } from 'apollo-server-express';
import { Config } from 'apollo-server-core/src/types';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { PluginDefinition, ValidationRule, GQLArmorConfig, PluginUpdateEvent, PluginState } from './types';
import { ConfigService } from './config';

/**
 * Armored Config
 * @description
 * This will inject remediations into the config.
 * @param apolloConfig The ApolloConfig object
 * @param armorConfig  The GQLArmorConfig object
 * @param onPluginUpdate  The function to call when a plugin is updated
 * @returns The configuration object with the remediation injected
 */
function ArmoredConfig<ContextFunctionParams>(
  apolloConfig: Config<ContextFunctionParams>,
  armorConfig?: GQLArmorConfig,
  onPluginUpdate?: PluginUpdateEvent,
): Config<ContextFunctionParams> {
  const service = new GQLArmor(armorConfig, onPluginUpdate);
  return service.getConfig(apolloConfig);
}

/**
 *  Armored Config Unsafe
 *  @description
 *  This is a wrapper around the `ArmoredConfig` function.
 *  It is used to create a config that is safe to use in a production environment.
 *  @param config We except an object with the same shape as the `ApolloConfig` object.
 *                ie: `validationRules`, `plugins`, ...properties
 *  @returns The configuration object with the remediation injected.
 **/
function ArmoredConfigU(config: any): any {
  const service = new GQLArmor();
  return service.getConfig(config);
}

class GQLArmor {
  private readonly _plugins: ArmorPlugin[] = [];
  private readonly _configService: ConfigService;
  private readonly _onPluginUpdate?: PluginUpdateEvent;

  /*
   * Push each plugin to the plugins array
   */
  constructor(config?: GQLArmorConfig, onPluginUpdate?: PluginUpdateEvent) {
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

  public getPlugins(): PluginDefinition[] {
    let apolloPlugins: PluginDefinition[] = [];
    for (const plugin of this._plugins) {
      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
    }
    return apolloPlugins;
  }

  public getValidationRules(): ValidationRule[] {
    let validationRules: ValidationRule[] = [];
    for (const plugin of this._plugins) {
      validationRules = [...validationRules, ...plugin.getValidationRules()];
    }
    return validationRules;
  }

  public getConfig<ContextFunctionParams>(apolloConfig: Config<ContextFunctionParams>): Config<ContextFunctionParams> {
    apolloConfig.plugins ??= [];
    apolloConfig.validationRules ??= [];

    for (const plugin of this._plugins) {
      apolloConfig = plugin.apolloPatchConfig(apolloConfig);
    }

    apolloConfig.plugins = [...this.getPlugins(), ...apolloConfig.plugins!];
    apolloConfig.validationRules = [...this.getValidationRules(), ...apolloConfig.validationRules!];

    return apolloConfig;
  }

  public apolloServer<ContextFunctionParams>(
    apolloConfig: Config<ContextFunctionParams>,
  ): ApolloServer<ContextFunctionParams> {
    return new ApolloServer<ContextFunctionParams>(this.getConfig(apolloConfig));
  }
}

export { GQLArmor, ArmoredConfig, ArmoredConfigU };
