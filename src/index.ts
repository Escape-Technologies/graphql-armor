import { ApolloServer } from 'apollo-server-express';
import { Config } from 'apollo-server-core/src/types';
import { ExpressContext } from 'apollo-server-express/src/ApolloServer';

import * as Plugins from './plugins/';

import { ArmorPlugin } from './ArmorPlugin';
import { PluginDefinition, ValidationRule } from './types';

export type ArmorConfig = any;

export class GQLArmor {
  private readonly armorPlugins: ArmorPlugin[] = [];

  /*
   * Push each plugin to the armorPlugins array
   */
  constructor(config: ArmorConfig) {
    for (const plugin of Object.values(Plugins)) {
      this.armorPlugins.push(new plugin(this, config));
    }
  }

  /*
   * Inject into the ApolloServer constructor
   */
  public apolloServer<ContextFunctionParams = ExpressContext>(
    config: Config<ContextFunctionParams>
  ) {
    config.plugins ??= [];
    config.validationRules ??= [];

    let apolloPlugins: PluginDefinition[] = [];
    let validationRules: ValidationRule[] = [];

    for (const plugin of this.armorPlugins) {
      config = plugin.apolloPatchConfig(config);

      apolloPlugins = [...apolloPlugins, ...plugin.getApolloPlugins()];
      validationRules = [...validationRules, ...plugin.getValidationRules()];
    }

    // We prepend our plugins/rules
    // So that we can protect the following user-defined plugins from attacks
    config.plugins = [...apolloPlugins, ...config.plugins!];
    config.validationRules = [...validationRules, ...config.validationRules!];

    return new ApolloServer<ContextFunctionParams>(config);
  }
}
