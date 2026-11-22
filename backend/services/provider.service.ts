import { ProviderRepository } from "@/backend/repositories/provider.repository";

export class ProviderService {
  static async getProviders() {
    const providers = await ProviderRepository.findAll();

    const formatted = providers.map((p) => {
      const minPromptPrice =
        p.pricings.length > 0
          ? Math.min(...p.pricings.map((pr) => pr.promptPerMillion))
          : 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        websiteUrl: p.websiteUrl,
        status: p.status,
        hostedModelsCount: p._count.pricings,
        lowestPricePerMillion: minPromptPrice,
        popularModels: p.pricings.map((pr) => ({
          name: pr.model.name,
          slug: pr.model.slug,
          promptPerMillion: pr.promptPerMillion,
        })),
      };
    });

    return {
      providers: formatted,
      total: formatted.length,
    };
  }
}
