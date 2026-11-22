import { ProviderService } from "@/backend/services/provider.service";
import { apiSuccess, apiError } from "@/backend/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await ProviderService.getProviders();
    return apiSuccess(result.providers, { total: result.total });
  } catch (err) {
    console.error("GET /api/providers error:", err);
    return apiError(
      "Failed to retrieve providers directory.",
      "PROVIDERS_QUERY_ERROR",
      500,
      err instanceof Error ? err.message : null
    );
  }
}
