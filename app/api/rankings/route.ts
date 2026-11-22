import { NextRequest } from "next/server";
import { RankingsService } from "@/backend/services/rankings.service";
import { parsePagination, apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = parsePagination(searchParams, 25, 100);
    const metric = searchParams.get("metric")?.toLowerCase() || "intelligence";
    const category = searchParams.get("category")?.toLowerCase() || "all";

    const allowedMetrics = ["intelligence", "coding", "agentic", "math", "arenaelo", "value"];
    if (!allowedMetrics.includes(metric)) {
      return apiError(
        `Invalid metric '${metric}'. Allowed values: ${allowedMetrics.join(", ")}`,
        "INVALID_METRIC",
        400
      );
    }

    const result = await RankingsService.getLeaderboard(metric, category, page, limit, skip);
    return apiSuccess(result.rankings, result.meta);
  } catch (err) {
    console.error("GET /api/rankings error:", err);
    return apiError(
      "Failed to retrieve model rankings.",
      "RANKINGS_QUERY_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
