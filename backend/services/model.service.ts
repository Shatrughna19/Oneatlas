import { ModelRepository } from "@/backend/repositories/model.repository";
import { ModelQueryParams } from "@/backend/validators/model.validator";

export class ModelService {
  static async getModels(params: ModelQueryParams) {
    const { total, models: rawModels } = await ModelRepository.findManyPaginated(params);

    const models = rawModels.map((model) => {
      const promptPrices = model.pricings.map((p) => p.promptPrice);
      const completionPrices = model.pricings.map((p) => p.completionPrice);
      const promptPerMs = model.pricings.map((p) => p.promptPerMillion);
      const completionPerMs = model.pricings.map((p) => p.completionPerMillion);

      const minPromptPrice = promptPrices.length > 0 ? Math.min(...promptPrices) : 0;
      const minCompletionPrice = completionPrices.length > 0 ? Math.min(...completionPrices) : 0;
      const minPromptPerMillion = promptPerMs.length > 0 ? Math.min(...promptPerMs) : 0;
      const minCompletionPerMillion = completionPerMs.length > 0 ? Math.min(...completionPerMs) : 0;

      return {
        id: model.id,
        name: model.name,
        slug: model.slug,
        description: model.description,
        modelType: model.modelType,
        modality: model.modality,
        inputModalities: model.inputModalities,
        outputModalities: model.outputModalities,
        contextLength: model.contextLength,
        maxCompletionTokens: model.maxCompletionTokens,
        tokenizer: model.tokenizer,
        capabilities: {
          tools: model.supportsTools,
          vision: model.supportsVision,
          reasoning: model.supportsReasoning,
          structuredOutputs: model.supportsStructuredOutputs,
        },
        releaseDate: model.releaseDate ? model.releaseDate.toISOString() : null,
        lab: model.lab,
        benchmark: model.benchmark,
        pricing: {
          minPromptPrice,
          minCompletionPrice,
          minPromptPerMillion,
          minCompletionPerMillion,
          providersCount: model.pricings.length,
          tiers: model.pricings.map((p) => ({
            id: p.id,
            provider: p.provider,
            promptPrice: p.promptPrice,
            completionPrice: p.completionPrice,
            promptPerMillion: p.promptPerMillion,
            completionPerMillion: p.completionPerMillion,
          })),
        },
      };
    });

    if (params.sortBy === "price") {
      models.sort((a, b) => {
        const diff = a.pricing.minPromptPerMillion - b.pricing.minPromptPerMillion;
        return params.sortOrder === "asc" ? diff : -diff;
      });
    }

    const totalPages = Math.ceil(total / params.limit);

    return {
      models,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  }

  static async getModelBySlug(identifier: string) {
    const model = await ModelRepository.findBySlugOrId(identifier);
    if (!model) return null;

    const promptPrices = model.pricings.map((p) => p.promptPrice);
    const completionPrices = model.pricings.map((p) => p.completionPrice);
    const promptPerMs = model.pricings.map((p) => p.promptPerMillion);
    const completionPerMs = model.pricings.map((p) => p.completionPerMillion);

    const minPromptPrice = promptPrices.length > 0 ? Math.min(...promptPrices) : 0;
    const minCompletionPrice = completionPrices.length > 0 ? Math.min(...completionPrices) : 0;
    const minPromptPerMillion = promptPerMs.length > 0 ? Math.min(...promptPerMs) : 0;
    const minCompletionPerMillion = completionPerMs.length > 0 ? Math.min(...completionPerMs) : 0;

    const sampleInputTokens = 100_000;
    const sampleOutputTokens = 25_000;
    const estimatedQueryCost =
      (sampleInputTokens / 1_000_000) * minPromptPerMillion +
      (sampleOutputTokens / 1_000_000) * minCompletionPerMillion;

    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      modelType: model.modelType,
      modality: model.modality,
      inputModalities: model.inputModalities,
      outputModalities: model.outputModalities,
      contextLength: model.contextLength,
      maxCompletionTokens: model.maxCompletionTokens,
      tokenizer: model.tokenizer,
      status: model.status,
      releaseDate: model.releaseDate ? model.releaseDate.toISOString() : null,
      capabilities: {
        tools: model.supportsTools,
        vision: model.supportsVision,
        reasoning: model.supportsReasoning,
        structuredOutputs: model.supportsStructuredOutputs,
      },
      lab: model.lab,
      benchmark: model.benchmark,
      pricing: {
        minPromptPrice,
        minCompletionPrice,
        minPromptPerMillion,
        minCompletionPerMillion,
        providersCount: model.pricings.length,
        cheapestProvider: model.pricings[0]?.provider.name || null,
        sampleCostEstimate: {
          sampleInputTokens,
          sampleOutputTokens,
          estimatedTotalCostUSD: Number(estimatedQueryCost.toFixed(5)),
        },
        providers: model.pricings.map((p) => ({
          id: p.id,
          provider: {
            id: p.provider.id,
            name: p.provider.name,
            slug: p.provider.slug,
            websiteUrl: p.provider.websiteUrl,
            status: p.provider.status,
          },
          promptPrice: p.promptPrice,
          completionPrice: p.completionPrice,
          promptPerMillion: p.promptPerMillion,
          completionPerMillion: p.completionPerMillion,
        })),
      },
    };
  }
}
