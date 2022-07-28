export type PluginConfig = {
  enabled: boolean;
  options?: any;
};

export class ConfigService {
  public plugins: PluginConfig[] = [];

  constructor() {
    // ToDO: Read ENV vars
  }

  public getPluginConfig(key: string): PluginConfig {
    return { enabled: true };
  }
}
