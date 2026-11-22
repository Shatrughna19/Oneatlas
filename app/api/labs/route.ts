import { NextRequest } from "next/server";
import { LabService } from "@/backend/services/lab.service";
import { apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim() || undefined;
    const result = await LabService.getLabs(search);
    return apiSuccess(result.labs, { total: result.total });
  } catch (err) {
    console.error("GET /api/labs error:", err);
    return apiError(
      "Failed to retrieve AI labs directory.",
      "LABS_QUERY_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
