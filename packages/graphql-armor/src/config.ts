import {
  CharacterLimitOptions,
  CostAnalysisOptions,
  BlockFieldSuggestionOptions,
  ProtectionConfiguration,
} from './plugins';

export type GraphQLArmorConfig = {
  characterLimit?: ProtectionConfiguration<CharacterLimitOptions>;
  costAnalysis?: ProtectionConfiguration<CostAnalysisOptions>;
  blockFieldSuggestion?: ProtectionConfiguration<BlockFieldSuggestionOptions>;
};
