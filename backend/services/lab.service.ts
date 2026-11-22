import { LabRepository } from "@/backend/repositories/lab.repository";

export class LabService {
  static async getLabs(search?: string) {
    const labs = await LabRepository.findAll(search);

    const formatted = labs.map((lab) => {
      const topModel = lab.models[0] || null;
      return {
        id: lab.id,
        name: lab.name,
        slug: lab.slug,
        description: lab.description,
        websiteUrl: lab.websiteUrl,
        totalModels: lab._count.models,
        flagshipModel: topModel
          ? {
              id: topModel.id,
              name: topModel.name,
              slug: topModel.slug,
              modelType: topModel.modelType,
              intelligenceIndex: topModel.benchmark?.intelligenceIndex ?? null,
            }
          : null,
        recentModels: lab.models.map((m) => ({
          name: m.name,
          slug: m.slug,
        })),
      };
    });

    return {
      labs: formatted,
      total: formatted.length,
    };
  }
}
