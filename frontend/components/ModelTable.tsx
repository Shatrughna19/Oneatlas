"use client";

import { ModelItem } from "@/frontend/types";

interface ModelTableProps {
  models: ModelItem[];
  loading: boolean;
  error: string | null;
  selectedModelIds: string[];
  onToggleSelection: (id: string) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRetry: () => void;
}

export function ModelTable({
  models,
  loading,
  error,
  selectedModelIds,
  onToggleSelection,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onRetry,
}: ModelTableProps) {
  function formatTokens(count: number | null): string {
    if (!count) return "N/A";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
    return count.toLocaleString();
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500">Querying backend database via /api/models...</p>
        </div>
      ) : error ? (
        <div className="py-12 px-6 text-center text-red-600 space-y-2">
          <p className="font-bold">Error loading models</p>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-md cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : models.length === 0 ? (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="text-base font-semibold">No models matched your criteria</p>
          <p className="text-xs">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Compare</th>
                <th className="py-3 px-4">Model & Creator Lab</th>
                <th className="py-3 px-4">Type & Capabilities</th>
                <th className="py-3 px-4 text-center">Intelligence Index</th>
                <th className="py-3 px-4 text-right">Context Window</th>
                <th className="py-3 px-4 text-right">Pricing (per 1M tokens)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map((model) => {
                const isSelected = selectedModelIds.includes(model.id);
                return (
                  <tr
                    key={model.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelection(model.id)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        title="Select to compare (up to 4)"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{model.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-medium">
                          {model.lab?.name || "Independent"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{model.slug}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded capitalize">
                          {model.modelType}
                        </span>
                        {model.capabilities.tools && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                            Tools
                          </span>
                        )}
                        {model.capabilities.vision && (
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded">
                            Vision
                          </span>
                        )}
                        {model.capabilities.reasoning && (
                          <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded">
                            Thinking
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 font-mono">
                        {model.benchmark?.intelligenceIndex ?? "—"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-medium text-slate-800">
                        {formatTokens(model.contextLength)}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {model.contextLength
                          ? `${model.contextLength.toLocaleString()} tokens`
                          : "unspecified"}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-xs">
                      <div className="text-emerald-700 font-semibold">
                        In: ${model.pricing.minPromptPerMillion.toFixed(4)}
                      </div>
                      <div className="text-blue-700 font-semibold">
                        Out: ${model.pricing.minCompletionPerMillion.toFixed(4)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <div>
          Showing Page <strong className="text-slate-900">{page}</strong> of{" "}
          <strong className="text-slate-900">{totalPages}</strong> ({totalCount} total models)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
