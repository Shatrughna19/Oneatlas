"use client";

import { useEffect, useState } from "react";
import { Header } from "@/frontend/components/Header";
import { FilterBar } from "@/frontend/components/FilterBar";
import { ModelCard } from "@/frontend/components/ModelCard";
import { ModelTable } from "@/frontend/components/ModelTable";
import { ComparisonDrawer } from "@/frontend/components/ComparisonDrawer";
import { ComparisonView } from "@/frontend/components/ComparisonView";
import { ModelItem, ProviderItem, ComparisonResult } from "@/frontend/types";

export function DiscoveryPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("intelligence");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Capabilities filters
  const [filterTools, setFilterTools] = useState(false);
  const [filterVision, setFilterVision] = useState(false);
  const [filterReasoning, setFilterReasoning] = useState(false);

  // View mode: Grid of cards (default, cleaner) vs List table
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  // Load providers count on mount
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch("/api/providers");
        const json = await res.json();
        if (json.success) {
          setProviders(json.data || []);
        }
      } catch (err) {
        console.error("Provider fetch error:", err);
      }
    }
    loadProviders();
  }, []);

  // Fetch models with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModels();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedType, sortBy, sortOrder, filterTools, filterVision, filterReasoning, page]);

  async function fetchModels() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedType) params.set("modelType", selectedType);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      params.set("page", String(page));
      params.set("limit", "24");

      const caps: string[] = [];
      if (filterTools) caps.push("tools");
      if (filterVision) caps.push("vision");
      if (filterReasoning) caps.push("reasoning");
      if (caps.length > 0) params.set("capabilities", caps.join(","));

      const res = await fetch(`/api/models?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || `HTTP error ${res.status}`);
      }

      setModels(json.data || []);
      setTotalPages(json.meta?.totalPages || 1);
      setTotalCount(json.meta?.total || 0);
    } catch (err) {
      console.error("Error fetching models:", err);
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }

  function toggleModelSelection(modelId: string) {
    setSelectedModelIds((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), modelId];
      }
      return [...prev, modelId];
    });
  }

  async function handleCompare() {
    if (selectedModelIds.length < 2) return;
    setComparisonLoading(true);
    setComparisonError(null);
    try {
      const res = await fetch(`/api/models/compare?ids=${selectedModelIds.join(",")}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || `HTTP error ${res.status}`);
      }
      setComparisonData(json.data);
    } catch (err) {
      console.error("Comparison error:", err);
      setComparisonError(err instanceof Error ? err.message : "Failed to compare models");
    } finally {
      setComparisonLoading(false);
    }
  }

  function handleResetFilters() {
    setSearch("");
    setSelectedType("");
    setFilterTools(false);
    setFilterVision(false);
    setFilterReasoning(false);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* 1. Clean Header */}
      <Header
        totalCount={totalCount}
        providersCount={providers.length}
      />

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3. Search and Category Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          selectedType={selectedType}
          onTypeChange={(val) => {
            setSelectedType(val);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={(val) => {
            setSortBy(val);
            setPage(1);
          }}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => {
            setSortOrder(val);
            setPage(1);
          }}
          filterTools={filterTools}
          onFilterToolsChange={(val) => {
            setFilterTools(val);
            setPage(1);
          }}
          filterVision={filterVision}
          onFilterVisionChange={(val) => {
            setFilterVision(val);
            setPage(1);
          }}
          filterReasoning={filterReasoning}
          onFilterReasoningChange={(val) => {
            setFilterReasoning(val);
            setPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Models View: Clean Grid or Clean Table */}
        {viewMode === "grid" ? (
          <div>
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">Loading foundation models...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-red-200 p-12 text-center space-y-2">
                <p className="text-sm font-semibold text-red-600">Failed to load models</p>
                <p className="text-xs text-slate-500">{error}</p>
                <button
                  onClick={fetchModels}
                  className="mt-2 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : models.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">No models found</p>
                <p className="text-xs text-slate-400">Try adjusting your search terms or category pills.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={selectedModelIds.includes(model.id)}
                    onToggleSelect={toggleModelSelection}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <ModelTable
            models={models}
            loading={loading}
            error={error}
            selectedModelIds={selectedModelIds}
            onToggleSelection={toggleModelSelection}
            onRetry={fetchModels}
          />
        )}

        {/* 5. Minimal Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
            <div>
              Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total models)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 6. Unobtrusive Floating Bottom Dock for Comparison */}
      <ComparisonDrawer
        selectedCount={selectedModelIds.length}
        loading={comparisonLoading}
        onCompare={handleCompare}
        onClear={() => setSelectedModelIds([])}
        errorMessage={comparisonError}
      />

      {/* 7. Focused Modal for Comparison */}
      {comparisonData && (
        <ComparisonView
          data={comparisonData}
          onClose={() => setComparisonData(null)}
        />
      )}
    </div>
  );
}
