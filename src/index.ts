import { ApolloServer } from 'apollo-server-express';
import { Config } from 'apollo-server-core/src/types';
import { ExpressContext } from 'apollo-server-express/src/ApolloServer';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { PluginDefinition, ValidationRule } from './types';
import { ConfigService } from './config';

export class GQLArmor {
  private readonly plugins: ArmorPlugin[] = [];

  /*
   * Push each plugin to the armorPlugins array
   */
  constructor(config?: ConfigService) {
    config ??= new ConfigService();

    for (const plugin of Object.values(Plugins)) {
      const pluginName = plugin.name.toLocaleLowerCase();
      const pluginConfig = config.getPluginConfig(pluginName);

      if (pluginConfig.enabled)
        this.plugins.push(new plugin(this, pluginConfig));
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

    for (const plugin of this.plugins) {
      apolloConfig = plugin.apolloPatchConfig(apolloConfig);

      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
      validationRules = [...validationRules, ...plugin.getValidationRules()];
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
