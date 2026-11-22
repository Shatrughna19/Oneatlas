import prisma from "@/backend/db/prisma";
import { Prisma } from "@prisma/client";

export class RankingsService {
  static async getLeaderboard(
    metric: string = "intelligence",
    category: string = "all",
    page: number = 1,
    limit: number = 25,
    skip: number = 0
  ) {
    const where: Prisma.ModelWhereInput = {
      benchmark: { isNot: null },
      ...(category && category !== "all"
        ? { modelType: { equals: category, mode: "insensitive" } }
        : {}),
    };

    let orderBy: Prisma.ModelOrderByWithRelationInput = {
      benchmark: { intelligenceIndex: "desc" },
    };

    if (metric === "coding") {
      orderBy = { benchmark: { codingIndex: "desc" } };
    } else if (metric === "agentic") {
      orderBy = { benchmark: { agenticIndex: "desc" } };
    } else if (metric === "math") {
      orderBy = { benchmark: { mathIndex: "desc" } };
    } else if (metric === "arenaelo") {
      orderBy = { benchmark: { arenaElo: "desc" } };
    }

    const [total, rawModels] = await Promise.all([
      prisma.model.count({ where }),
      prisma.model.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          lab: {
            select: {
              name: true,
              slug: true,
            },
          },
          benchmark: true,
          pricings: {
            select: {
              promptPerMillion: true,
              completionPerMillion: true,
            },
            orderBy: {
              promptPerMillion: "asc",
            },
            take: 1,
          },
        },
      }),
    ]);

    const rankings = rawModels.map((m, index) => {
      const minPromptPerM = m.pricings[0]?.promptPerMillion ?? 0;
      const intelligence = m.benchmark?.intelligenceIndex ?? 0;

      const valueScore =
        minPromptPerM > 0
          ? Number((intelligence / Math.max(minPromptPerM, 0.01)).toFixed(2))
          : Number((intelligence * 10).toFixed(2));

      return {
        rank: skip + index + 1,
        id: m.id,
        name: m.name,
        slug: m.slug,
        modelType: m.modelType,
        contextLength: m.contextLength,
        lab: m.lab?.name || "Independent",
        labSlug: m.lab?.slug || "independent",
        benchmark: {
          intelligenceIndex: m.benchmark?.intelligenceIndex ?? null,
          codingIndex: m.benchmark?.codingIndex ?? null,
          agenticIndex: m.benchmark?.agenticIndex ?? null,
          mathIndex: m.benchmark?.mathIndex ?? null,
          arenaElo: m.benchmark?.arenaElo ?? null,
          valueScore,
        },
        pricing: {
          promptPerMillion: minPromptPerM,
          completionPerMillion: m.pricings[0]?.completionPerMillion ?? 0,
        },
      };
    });

    if (metric === "value") {
      rankings.sort((a, b) => b.benchmark.valueScore - a.benchmark.valueScore);
      rankings.forEach((r, idx) => {
        r.rank = skip + idx + 1;
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      rankings,
      meta: {
        page,
        limit,
        total,
        totalPages,
        metric,
        category,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
