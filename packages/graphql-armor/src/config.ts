import { ProtectionConfiguration } from './plugins/base-protection';
import { CharacterLimitOptions, CostAnalysisOptions, BlockFieldSuggestionOptions } from './plugins/protection-options';

export type GraphQLArmorConfig = {
  characterLimit?: ProtectionConfiguration<CharacterLimitOptions>;
  costAnalysis?: ProtectionConfiguration<CostAnalysisOptions>;
  blockFieldSuggestion?: ProtectionConfiguration<BlockFieldSuggestionOptions>;
};
