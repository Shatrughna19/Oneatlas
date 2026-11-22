import { ModelRepository } from "@/backend/repositories/model.repository";

export class CompareService {
  static async compareModels(idList: string[]) {
    const foundModels = await ModelRepository.findByIdsOrSlugs(idList);

    if (foundModels.length === 0) {
      return { found: false, models: [], missingIds: idList };
    }

    const normalizedModels = foundModels.map((m) => {
      const promptPerMs = m.pricings.map((p) => p.promptPerMillion);
      const completionPerMs = m.pricings.map((p) => p.completionPerMillion);

      const minPromptPerMillion =
        promptPerMs.length > 0 ? Math.min(...promptPerMs) : 0;
      const minCompletionPerMillion =
        completionPerMs.length > 0 ? Math.min(...completionPerMs) : 0;

      return {
        id: m.id,
        name: m.name,
        slug: m.slug,
        description: m.description,
        modelType: m.modelType,
        modality: m.modality,
        contextLength: m.contextLength,
        maxCompletionTokens: m.maxCompletionTokens,
        releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
        lab: m.lab,
        benchmark: m.benchmark,
        capabilities: {
          tools: m.supportsTools,
          vision: m.supportsVision,
          reasoning: m.supportsReasoning,
          structuredOutputs: m.supportsStructuredOutputs,
        },
        pricing: {
          minPromptPerMillion,
          minCompletionPerMillion,
          providersCount: m.pricings.length,
          providers: m.pricings.map((p) => ({
            provider: p.provider.name,
            promptPerMillion: p.promptPerMillion,
            completionPerMillion: p.completionPerMillion,
          })),
        },
      };
    });

    const maxContext = Math.max(...normalizedModels.map((m) => m.contextLength || 0));
    const minPromptPerM = Math.min(...normalizedModels.map((m) => m.pricing.minPromptPerMillion));
    const minCompletionPerM = Math.min(...normalizedModels.map((m) => m.pricing.minCompletionPerMillion));
    const maxIntelligence = Math.max(...normalizedModels.map((m) => m.benchmark?.intelligenceIndex || 0));
    const maxCoding = Math.max(...normalizedModels.map((m) => m.benchmark?.codingIndex || 0));

    const comparisonMatrix = {
      cheapestInput: {
        minPricePerMillion: minPromptPerM,
        winners: normalizedModels
          .filter((m) => m.pricing.minPromptPerMillion === minPromptPerM)
          .map((m) => m.name),
      },
      cheapestOutput: {
        minPricePerMillion: minCompletionPerM,
        winners: normalizedModels
          .filter((m) => m.pricing.minCompletionPerMillion === minCompletionPerM)
          .map((m) => m.name),
      },
      largestContext: {
        tokens: maxContext,
        winners: normalizedModels
          .filter((m) => (m.contextLength || 0) === maxContext)
          .map((m) => m.name),
      },
      highestIntelligence: {
        score: maxIntelligence,
        winners: normalizedModels
          .filter((m) => (m.benchmark?.intelligenceIndex || 0) === maxIntelligence)
          .map((m) => m.name),
      },
      highestCoding: {
        score: maxCoding,
        winners: normalizedModels
          .filter((m) => (m.benchmark?.codingIndex || 0) === maxCoding)
          .map((m) => m.name),
      },
    };

    return {
      found: true,
      models: normalizedModels,
      comparison: comparisonMatrix,
      count: normalizedModels.length,
      missingIds: idList.filter(
        (id) => !foundModels.some((m) => m.id === id || m.slug === id)
      ),
    };
  }
}
