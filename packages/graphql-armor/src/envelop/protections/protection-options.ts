import { CostAnalysisOptions } from "../../config";

export type BlockFieldSuggestionOptions = undefined;

export type CharacterLimitOptions = { maxLength: number };

export type ProtectionOptions = BlockFieldSuggestionOptions | CharacterLimitOptions | CostAnalysisOptions;
