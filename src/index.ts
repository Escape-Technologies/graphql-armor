import {ApolloServer} from 'apollo-server-express';
import {Config} from 'apollo-server-core/src/types';
import {ExpressContext} from 'apollo-server-express/src/ApolloServer';
import {CharacterLimitPlugin, DisableIntrospectionPlugin} from './plugins';
import {ArmorPlugin} from './ArmorPlugin';
import {PluginDefinition, ValidationRule} from './types';

export type ArmorConfig = any;

export class Armor {
  private armorPlugins: ArmorPlugin[] = [];

  constructor(config: ArmorConfig) {
    // here we add new plugins (to be moved somewhere else)
    this.armorPlugins.push(new DisableIntrospectionPlugin(this));
    this.armorPlugins.push(new CharacterLimitPlugin(this));
  }


  public apolloServer<ContextFunctionParams = ExpressContext>(config: Config<ContextFunctionParams>) {
    config.plugins ||= [];
    config.validationRules ||= [];

    let apolloPlugins: PluginDefinition[] = [];
    let validationRules: ValidationRule[] = [];

    for (const plugin of this.armorPlugins) {
      config = plugin.apolloPatchConfig(config);
      apolloPlugins=apolloPlugins.concat(plugin.getApolloPlugins());
      validationRules=validationRules.concat(plugin.getValidationRules());
    }

    // We prepend our plugins/rules
    // So that we can protect the following user-defined plugins from attacks
    config.plugins = apolloPlugins.concat(config.plugins as PluginDefinition[]);
    config.validationRules = validationRules.concat(config.validationRules as ValidationRule[]);


    return new ApolloServer<ContextFunctionParams>(config);
  };
}

