export interface ModelQueryParams {
  search?: string;
  lab?: string;
  provider?: string;
  modelType?: string;
  capabilities?: string[];
  minContext?: number;
  maxPrice?: number;
  sortBy?: "intelligence" | "price" | "context" | "releasedate" | "name";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
  skip: number;
}

export function validateModelQueryParams(searchParams: URLSearchParams): {
  params?: ModelQueryParams;
  error?: string;
} {
  const allowedSortFields = ["intelligence", "price", "context", "releasedate", "name"];
  const sortByRaw = searchParams.get("sortBy")?.toLowerCase() || "intelligence";

  if (!allowedSortFields.includes(sortByRaw)) {
    return {
      error: `Invalid 'sortBy' parameter. Allowed values: ${allowedSortFields.join(", ")}`,
    };
  }

  const sortOrderRaw = searchParams.get("sortOrder")?.toLowerCase();
  const sortOrder: "asc" | "desc" = sortOrderRaw === "asc" ? "asc" : "desc";

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limitParam = parseInt(searchParams.get("limit") || "20", 10) || 20;
  const limit = Math.min(Math.max(1, limitParam), 100);
  const skip = (page - 1) * limit;

  const capabilitiesParam = searchParams.get("capabilities")?.trim();
  const capabilities = capabilitiesParam
    ? capabilitiesParam.split(",").map((c) => c.trim().toLowerCase())
    : [];

  return {
    params: {
      search: searchParams.get("search")?.trim() || undefined,
      lab: searchParams.get("lab")?.trim() || undefined,
      provider: searchParams.get("provider")?.trim() || undefined,
      modelType: searchParams.get("modelType")?.trim() || undefined,
      capabilities,
      minContext: parseInt(searchParams.get("minContext") || "0", 10) || undefined,
      maxPrice: parseFloat(searchParams.get("maxPrice") || "0") || undefined,
      sortBy: sortByRaw as ModelQueryParams["sortBy"],
      sortOrder,
      page,
      limit,
      skip,
    },
  };
}
