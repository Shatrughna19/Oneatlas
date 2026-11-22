import prisma from "@/backend/db/prisma";

export class ProviderRepository {
  static async findAll() {
    return prisma.provider.findMany({
      orderBy: {
        pricings: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        websiteUrl: true,
        status: true,
        _count: {
          select: {
            pricings: true,
          },
        },
        pricings: {
          take: 3,
          orderBy: {
            promptPerMillion: "asc",
          },
          select: {
            promptPerMillion: true,
            completionPerMillion: true,
            model: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  }
}
