import { ApolloServer } from 'apollo-server-express';
import { Config } from 'apollo-server-core/src/types';
import { ExpressContext } from 'apollo-server-express/src/ApolloServer';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { PluginDefinition, ValidationRule, ArmorConfig } from './types';
import { ConfigService } from './config';

export class GQLArmor {
  private readonly _plugins: ArmorPlugin[] = [];
  private readonly _configService: ConfigService;

  /*
   * Push each plugin to the plugins array
   */
  constructor(config?: ArmorConfig) {
    this._configService = new ConfigService(config);

    for (const plugin of Object.values(Plugins)) {
      const pluginConfig = this._configService.getPluginConfig(plugin.name);

      if (pluginConfig.enabled) {
        this._plugins.push(new plugin(this, pluginConfig));
      }
    }
  }

  /*
   * Inject remediations into the ApolloServer constructor
   */
  public apolloServer<ContextFunctionParams = ExpressContext>(
    apolloConfig: Config<ContextFunctionParams>
  ) {
    apolloConfig.plugins ??= [];
    apolloConfig.validationRules ??= [];

    let apolloPlugins: PluginDefinition[] = [];
    let validationRules: ValidationRule[] = [];

    for (const plugin of this._plugins) {
      apolloConfig = plugin.apolloPatchConfig(apolloConfig);

      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
      validationRules = [...validationRules, ...plugin.getValidationRules()];

      console.log(`[GraphQLArmor] Enabled plugin for ${plugin.getNamespace()}`);
    }

    // We prepend our plugins/rules
    // So that we can protect the following user-defined plugins from attacks
    apolloConfig.plugins = [...apolloPlugins, ...apolloConfig.plugins!];
    apolloConfig.validationRules = [
      ...validationRules,
      ...apolloConfig.validationRules!,
    ];

    return new ApolloServer<ContextFunctionParams>(apolloConfig);
  }
}
