"use client";

import { ModelItem } from "@/frontend/types";

interface ModelTableProps {
  models: ModelItem[];
  loading: boolean;
  error: string | null;
  selectedModelIds: string[];
  onToggleSelection: (id: string) => void;
  onRetry: () => void;
}

export function ModelTable({
  models,
  loading,
  error,
  selectedModelIds,
  onToggleSelection,
  onRetry,
}: ModelTableProps) {
  function formatTokens(count: number | null): string {
    if (!count) return "N/A";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
    return count.toLocaleString();
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading foundation models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-10 text-center space-y-2">
        <p className="text-sm font-semibold text-red-600">Failed to load models</p>
        <p className="text-xs text-slate-500">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-16 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-700">No models found</p>
        <p className="text-xs text-slate-400">Try searching with different keywords or resetting your category filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium">
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4">Lab</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-right">Context</th>
              <th className="py-3 px-4 text-right">Prompt / 1M</th>
              <th className="py-3 px-4 text-right">Output / 1M</th>
              <th className="py-3 px-4 text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((model) => {
              const isSelected = selectedModelIds.includes(model.id);
              return (
                <tr
                  key={model.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{model.name}</div>
                    <div className="text-xs text-slate-400 font-mono truncate max-w-xs">{model.slug}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {model.lab?.name || "Independent"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-block font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {model.benchmark?.intelligenceIndex ?? "—"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-xs text-slate-700">
                    {formatTokens(model.contextLength)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-700">
                    ${model.pricing.minPromptPerMillion.toFixed(3)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-blue-700">
                    ${model.pricing.minCompletionPerMillion.toFixed(3)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleSelection(model.id)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "+ Compare"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
