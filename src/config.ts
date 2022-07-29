import { ArmorConfig, PluginConfig } from './types';
import { DefaultCharacterLimitConfig } from './plugins/CharacterLimit';
import { DefaultCostAnalysisConfig } from './plugins/CostAnalysis';
import { DefaultIntrospectionConfig } from './plugins/Introspection';
import { DefaultFieldSuggestionConfig } from './plugins/FieldSuggestion';

const defaultConfig: ArmorConfig = {
  CharacterLimit: DefaultCharacterLimitConfig, // 0x1
  CostAnalysis: DefaultCostAnalysisConfig, // 0x2
  Introspection: DefaultIntrospectionConfig, // 0x4
  FieldSuggestion: DefaultFieldSuggestionConfig, // 0x8
};

function applyBitwisePermissions(
  config: ArmorConfig,
  permUID: number
): ArmorConfig {
  let keyID = 0;
  for (const key in defaultConfig) {
    if (!config.hasOwnProperty(key)) {
      config[key] = { enabled: defaultConfig[key].enabled };
    }
    config[key].enabled = permUID & (1 << keyID++);
  }
  return config;
}

export class ConfigService {
  private readonly _plugins = new Map<string, PluginConfig>();

  constructor(config?: ArmorConfig) {
    config ??= {};

    const permissions = parseInt(process.env.ARMOR_PERMISSIONS || '-1', 10);
    if (permissions >= 0) {
      config = applyBitwisePermissions(config, permissions);
    }

    for (const key in defaultConfig) {
      let pluginConfig = defaultConfig[key];

      // override default config with user-defined config
      if (config && config[key]) {
        // clone the user-defined config
        const keyCpy = { ...config[key] };
        // delete the namespace if any
        if (keyCpy._namespace) {
          delete keyCpy._namespace;
        }
        // merge the user-defined config with the default config
        pluginConfig = { ...pluginConfig, ...keyCpy };
      }

      // add the plugin config to the map
      this._plugins.set(key, pluginConfig);
    }
  }

  public getPluginConfig(key: string): PluginConfig {
    const plugin = this._plugins.get(key);
    if (!plugin) {
      throw new Error(`Plugin ${key} not found`);
    }
    return plugin;
  }
}
