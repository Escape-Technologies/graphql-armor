import { BlockFieldSuggestionConfig } from './plugins/BlockFieldSuggestion';
import { CharacterLimitConfig } from './plugins/CharacterLimit';
import { CostAnalysisConfig } from './plugins/CostAnalysis';

// Config
export type PluginConfig = {
  _namespace?: string;
  enabled?: boolean;
  options?: any;
};

export type GraphQLArmorConfig = CharacterLimitConfig | CostAnalysisConfig | BlockFieldSuggestionConfig;
