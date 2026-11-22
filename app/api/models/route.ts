import { NextRequest } from "next/server";
import { ModelService } from "@/backend/services/model.service";
import { validateModelQueryParams } from "@/backend/validators/model.validator";
import { apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { params, error } = validateModelQueryParams(request.nextUrl.searchParams);
    if (error || !params) {
      return apiError(error || "Invalid query parameters.", "VALIDATION_ERROR", 400);
    }

    const result = await ModelService.getModels(params);
    return apiSuccess(result.models, result.meta);
  } catch (err) {
    console.error("GET /api/models error:", err);
    return apiError(
      "Failed to retrieve models from database.",
      "MODEL_FETCH_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
