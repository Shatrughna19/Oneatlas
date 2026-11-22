import prisma from "@/backend/db/prisma";
import { Prisma } from "@prisma/client";
import { ModelQueryParams } from "@/backend/validators/model.validator";

export class ModelRepository {
  static async findManyPaginated(params: ModelQueryParams) {
    const whereConditions: Prisma.ModelWhereInput[] = [];

    if (params.search) {
      whereConditions.push({
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { slug: { contains: params.search, mode: "insensitive" } },
          { description: { contains: params.search, mode: "insensitive" } },
          { lab: { name: { contains: params.search, mode: "insensitive" } } },
        ],
      });
    }

    if (params.lab && params.lab !== "all") {
      whereConditions.push({
        lab: {
          OR: [
            { slug: { equals: params.lab, mode: "insensitive" } },
            { name: { equals: params.lab, mode: "insensitive" } },
          ],
        },
      });
    }

    if (params.provider && params.provider !== "all") {
      whereConditions.push({
        pricings: {
          some: {
            provider: {
              OR: [
                { slug: { equals: params.provider, mode: "insensitive" } },
                { name: { equals: params.provider, mode: "insensitive" } },
              ],
            },
          },
        },
      });
    }

    if (params.modelType && params.modelType !== "all") {
      whereConditions.push({
        modelType: { equals: params.modelType, mode: "insensitive" },
      });
    }

    if (params.minContext && params.minContext > 0) {
      whereConditions.push({
        contextLength: { gte: params.minContext },
      });
    }

    if (params.capabilities && params.capabilities.length > 0) {
      if (params.capabilities.includes("tools")) {
        whereConditions.push({ supportsTools: true });
      }
      if (params.capabilities.includes("vision")) {
        whereConditions.push({ supportsVision: true });
      }
      if (params.capabilities.includes("reasoning")) {
        whereConditions.push({ supportsReasoning: true });
      }
      if (params.capabilities.includes("structured_outputs")) {
        whereConditions.push({ supportsStructuredOutputs: true });
      }
    }

    if (params.maxPrice && params.maxPrice > 0) {
      whereConditions.push({
        pricings: {
          some: {
            promptPerMillion: { lte: params.maxPrice },
          },
        },
      });
    }

    const where: Prisma.ModelWhereInput =
      whereConditions.length > 0 ? { AND: whereConditions } : {};

    let orderBy: Prisma.ModelOrderByWithRelationInput[] = [];
    const sortOrder = params.sortOrder || "desc";

    switch (params.sortBy) {
      case "context":
        orderBy = [{ contextLength: sortOrder }, { name: "asc" }];
        break;
      case "releasedate":
        orderBy = [{ releaseDate: sortOrder }, { name: "asc" }];
        break;
      case "name":
        orderBy = [{ name: sortOrder }];
        break;
      case "intelligence":
        orderBy = [{ benchmark: { intelligenceIndex: sortOrder } }, { name: "asc" }];
        break;
      case "price":
      default:
        orderBy = [{ benchmark: { intelligenceIndex: "desc" } }, { name: "asc" }];
        break;
    }

    const [total, models] = await Promise.all([
      prisma.model.count({ where }),
      prisma.model.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
        include: {
          lab: {
            select: {
              id: true,
              name: true,
              slug: true,
              websiteUrl: true,
            },
          },
          benchmark: {
            select: {
              intelligenceIndex: true,
              codingIndex: true,
              agenticIndex: true,
              mathIndex: true,
              arenaElo: true,
            },
          },
          pricings: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  status: true,
                },
              },
            },
            orderBy: {
              promptPerMillion: "asc",
            },
          },
        },
      }),
    ]);

    return { total, models };
  }

  static async findBySlugOrId(identifier: string) {
    return prisma.model.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
      },
      include: {
        lab: true,
        benchmark: true,
        pricings: {
          include: {
            provider: true,
          },
          orderBy: {
            promptPerMillion: "asc",
          },
        },
      },
    });
  }

  static async findByIdsOrSlugs(identifiers: string[]) {
    return prisma.model.findMany({
      where: {
        OR: [{ id: { in: identifiers } }, { slug: { in: identifiers } }],
      },
      include: {
        lab: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        benchmark: true,
        pricings: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
              },
            },
          },
          orderBy: {
            promptPerMillion: "asc",
          },
        },
      },
    });
  }
}
