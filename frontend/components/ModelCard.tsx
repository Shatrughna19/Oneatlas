"use client";

import { ModelItem } from "@/frontend/types";

interface ModelCardProps {
  model: ModelItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function ModelCard({ model, isSelected, onToggleSelect }: ModelCardProps) {
  function formatTokens(count: number | null): string {
    if (!count) return "N/A";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
    return count.toLocaleString();
  }

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div>
        {/* Top metadata row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-block text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            {model.lab?.name || "Independent"}
          </span>

          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
            {formatTokens(model.contextLength)} ctx
          </span>
        </div>

        {/* Model Name & Slug */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {model.name}
        </h3>
        <p className="text-xs text-slate-400 font-mono line-clamp-1 mt-0.5">
          {model.slug}
        </p>

        {/* Description snippet */}
        {model.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {model.description}
          </p>
        )}

        {/* Capabilities Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
            {model.modelType}
          </span>
          {model.capabilities.tools && (
            <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
              Tools
            </span>
          )}
          {model.capabilities.vision && (
            <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
              Vision
            </span>
          )}
          {model.capabilities.reasoning && (
            <span className="text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
              Thinking
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Pricing & Compare Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Pricing per 1M
          </div>
          <div className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
            <span className="text-emerald-700">${model.pricing.minPromptPerMillion.toFixed(3)}</span>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-blue-700">${model.pricing.minCompletionPerMillion.toFixed(3)}</span>
          </div>
        </div>

        <button
          onClick={() => onToggleSelect(model.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isSelected
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {isSelected ? "Selected ✓" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}
