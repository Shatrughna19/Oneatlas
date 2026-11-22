"use client";

import { ComparisonResult } from "@/frontend/types";

interface ComparisonViewProps {
  data: ComparisonResult;
  onClose: () => void;
}

export function ComparisonView({ data, onClose }: ComparisonViewProps) {
  function formatTokens(count: number | null): string {
    if (!count) return "N/A";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
    return count.toLocaleString();
  }

  return (
    <section className="bg-white border-2 border-indigo-500 rounded-xl p-6 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Side-by-Side Model Evaluation Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Multi-dimensional parametric evaluation generated from backend analytics.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md cursor-pointer"
        >
          Close View ✕
        </button>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
            Lowest Input Cost
          </span>
          <p className="text-base font-bold text-emerald-950 mt-1">
            ${data.comparison.cheapestInput.minPricePerMillion.toFixed(4)} / 1M
          </p>
          <p className="text-xs text-emerald-700 truncate mt-0.5">
            {data.comparison.cheapestInput.winners.join(", ")}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
            Lowest Output Cost
          </span>
          <p className="text-base font-bold text-blue-950 mt-1">
            ${data.comparison.cheapestOutput.minPricePerMillion.toFixed(4)} / 1M
          </p>
          <p className="text-xs text-blue-700 truncate mt-0.5">
            {data.comparison.cheapestOutput.winners.join(", ")}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">
            Largest Context
          </span>
          <p className="text-base font-bold text-purple-950 mt-1">
            {formatTokens(data.comparison.largestContext.tokens)} tokens
          </p>
          <p className="text-xs text-purple-700 truncate mt-0.5">
            {data.comparison.largestContext.winners.join(", ")}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Top Intelligence Index
          </span>
          <p className="text-base font-bold text-amber-950 mt-1">
            {data.comparison.highestIntelligence.score} / 100
          </p>
          <p className="text-xs text-amber-700 truncate mt-0.5">
            {data.comparison.highestIntelligence.winners.join(", ")}
          </p>
        </div>
      </div>

      {/* Side-by-side columns */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(data.models.length, 4)} gap-6`}>
        {data.models.map((m) => (
          <div key={m.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
            <div>
              <span className="text-xs bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                {m.lab?.name || "Independent"}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">{m.name}</h3>
              <code className="text-xs text-slate-500 break-all">{m.slug}</code>
            </div>

            <div className="space-y-2 text-sm border-t border-slate-200 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Intelligence Index</span>
                <strong className="text-indigo-700 font-mono">
                  {m.benchmark?.intelligenceIndex ?? "N/A"}/100
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Coding Index</span>
                <strong className="text-slate-800 font-mono">
                  {m.benchmark?.codingIndex ?? "N/A"}/100
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Context Window</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {m.contextLength ? m.contextLength.toLocaleString() : "N/A"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Input Price / 1M</span>
                <span className="font-mono text-emerald-700 font-bold">
                  ${m.pricing.minPromptPerMillion.toFixed(4)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Output Price / 1M</span>
                <span className="font-mono text-emerald-700 font-bold">
                  ${m.pricing.minCompletionPerMillion.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Capabilities check */}
            <div className="pt-2 text-xs space-y-1">
              <span className="font-semibold text-slate-700 block">Capabilities:</span>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded ${
                    m.capabilities.tools
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-400 line-through"
                  }`}
                >
                  Tools
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    m.capabilities.vision
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-400 line-through"
                  }`}
                >
                  Vision
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    m.capabilities.reasoning
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-400 line-through"
                  }`}
                >
                  Reasoning
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
