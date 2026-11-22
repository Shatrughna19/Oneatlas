import prisma from "@/backend/db/prisma";

export class LabRepository {
  static async findAll(search?: string) {
    return prisma.lab.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        _count: {
          select: {
            models: true,
          },
        },
        models: {
          take: 3,
          orderBy: {
            benchmark: {
              intelligenceIndex: "desc",
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            modelType: true,
            benchmark: {
              select: {
                intelligenceIndex: true,
              },
            },
          },
        },
      },
      orderBy: {
        models: {
          _count: "desc",
        },
      },
    });
  }
}
