"use client";

import { useEffect, useState } from "react";
import { Header } from "@/frontend/components/Header";
import { FilterBar } from "@/frontend/components/FilterBar";
import { ComparisonDrawer } from "@/frontend/components/ComparisonDrawer";
import { ComparisonView } from "@/frontend/components/ComparisonView";
import { ModelTable } from "@/frontend/components/ModelTable";
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

  // Load providers on mount
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

  // Fetch models on filter change
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
      params.set("limit", "20");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Header
        totalCount={totalCount}
        providersCount={providers.length}
        currentPage={page}
        totalPages={totalPages}
      />

      <ComparisonDrawer
        selectedCount={selectedModelIds.length}
        loading={comparisonLoading}
        onCompare={handleCompare}
        onClear={() => {
          setSelectedModelIds([]);
          setComparisonData(null);
        }}
        errorMessage={comparisonError}
      />

      {comparisonData && (
        <ComparisonView
          data={comparisonData}
          onClose={() => setComparisonData(null)}
        />
      )}

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
        onResetFilters={handleResetFilters}
      />

      <ModelTable
        models={models}
        loading={loading}
        error={error}
        selectedModelIds={selectedModelIds}
        onToggleSelection={toggleModelSelection}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onRetry={fetchModels}
      />
    </div>
  );
}
