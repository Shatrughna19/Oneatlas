import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function apiSuccess<T>(
  data: T,
  meta?: PaginationMeta | Record<string, unknown>,
  status: number = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        ...headers,
      },
    }
  );
}

export function apiError(
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  status: number = 500,
  details: unknown = null
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaultLimit: number = 20,
  maxLimit: number = 100
) {
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(
    searchParams.get("limit") || String(defaultLimit),
    10
  );

  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit =
    isNaN(limitParam) || limitParam < 1
      ? defaultLimit
      : Math.min(limitParam, maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
