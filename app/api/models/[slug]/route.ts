import { NextRequest } from "next/server";
import { ModelService } from "@/backend/services/model.service";
import { apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const decodedSlug = decodeURIComponent(slug);

    const model = await ModelService.getModelBySlug(decodedSlug);
    if (!model) {
      return apiError(
        `Model with slug or ID '${decodedSlug}' was not found.`,
        "MODEL_NOT_FOUND",
        404
      );
    }

    return apiSuccess(model);
  } catch (err) {
    console.error("GET /api/models/[slug] error:", err);
    return apiError(
      "Failed to retrieve model detail.",
      "MODEL_DETAIL_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
