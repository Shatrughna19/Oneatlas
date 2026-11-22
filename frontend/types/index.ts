export interface ModelPricingTier {
  id: string;
  provider: {
    id: string;
    name: string;
    slug: string;
  };
  promptPerMillion: number;
  completionPerMillion: number;
}

export interface ModelItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelType: string;
  modality: string;
  contextLength: number | null;
  releaseDate: string | null;
  lab: {
    id: string;
    name: string;
    slug: string;
  } | null;
  benchmark: {
    intelligenceIndex: number | null;
    codingIndex: number | null;
    agenticIndex: number | null;
    mathIndex: number | null;
    arenaElo: number | null;
  } | null;
  capabilities: {
    tools: boolean;
    vision: boolean;
    reasoning: boolean;
    structuredOutputs: boolean;
  };
  pricing: {
    minPromptPerMillion: number;
    minCompletionPerMillion: number;
    providersCount: number;
    tiers: ModelPricingTier[];
  };
}

export interface ProviderItem {
  id: string;
  name: string;
  slug: string;
  hostedModelsCount: number;
}

export interface ComparisonResult {
  models: ModelItem[];
  comparison: {
    cheapestInput: { minPricePerMillion: number; winners: string[] };
    cheapestOutput: { minPricePerMillion: number; winners: string[] };
    largestContext: { tokens: number; winners: string[] };
    highestIntelligence: { score: number; winners: string[] };
    highestCoding: { score: number; winners: string[] };
  };
}
