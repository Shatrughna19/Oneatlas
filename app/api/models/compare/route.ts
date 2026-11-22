import { NextRequest } from "next/server";
import { CompareService } from "@/backend/services/compare.service";
import { apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rawIds = request.nextUrl.searchParams.getAll("ids");
    const idList: string[] = [];

    for (const val of rawIds) {
      val.split(",").forEach((item) => {
        const trimmed = decodeURIComponent(item.trim());
        if (trimmed && !idList.includes(trimmed)) {
          idList.push(trimmed);
        }
      });
    }

    if (idList.length === 0) {
      return apiError(
        "Missing 'ids' query parameter. Provide at least two comma-separated model IDs or slugs (e.g., ?ids=model1,model2).",
        "MISSING_COMPARISON_IDS",
        400
      );
    }

    if (idList.length < 2) {
      return apiError(
        "Comparison requires at least two models. You provided only 1 valid model identifier.",
        "INSUFFICIENT_COMPARISON_MODELS",
        400,
        { receivedIds: idList }
      );
    }

    if (idList.length > 4) {
      return apiError(
        "Comparison is limited to a maximum of 4 models simultaneously.",
        "TOO_MANY_COMPARISON_MODELS",
        400,
        { count: idList.length }
      );
    }

    const result = await CompareService.compareModels(idList);
    if (!result.found) {
      return apiError(
        "None of the specified models were found in the database.",
        "MODELS_NOT_FOUND",
        404,
        { requestedIds: idList }
      );
    }

    return apiSuccess({
      models: result.models,
      comparison: result.comparison,
      count: result.count,
      missingIds: result.missingIds,
    });
  } catch (err) {
    console.error("GET /api/models/compare error:", err);
    return apiError(
      "Failed to compare models.",
      "COMPARISON_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
