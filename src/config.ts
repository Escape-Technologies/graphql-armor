export type PluginConfig = {
  namespace: string;
  enabled: boolean;
  options?: any;
};
export type ArmorConfig = {
  CharacterLimit: PluginConfig;
  CostAnalysis: PluginConfig;
  Introspection: PluginConfig;
};

export class ConfigService {
  public plugins: PluginConfig[] = [];

  constructor(config?: ArmorConfig) {
    // ToDO: Read ENV vars
  }

  public getPluginConfig(key: string): PluginConfig {
    return { enabled: true, namespace: key };
  }
}
