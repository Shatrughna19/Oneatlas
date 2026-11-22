"use client";

import { useEffect } from "react";
import { ComparisonResult } from "@/frontend/types";

interface ComparisonViewProps {
  data: ComparisonResult;
  onClose: () => void;
}

export function ComparisonView({ data, onClose }: ComparisonViewProps) {
  // Allow Esc key to close comparison
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function formatTokens(count: number | null): string {
    if (!count) return "N/A";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
    return count.toLocaleString();
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Model Comparison ({data.models.length} Models)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side technical evaluation across pricing, context, and capabilities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-sm font-bold"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Winner Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3">
            <div className="text-[11px] font-semibold uppercase text-emerald-800 tracking-wider">
              Lowest Input
            </div>
            <div className="text-sm font-bold text-emerald-950 font-mono mt-0.5">
              ${data.comparison.cheapestInput.minPricePerMillion.toFixed(3)}
            </div>
            <div className="text-[11px] text-emerald-700 truncate mt-0.5">
              {data.comparison.cheapestInput.winners.join(", ")}
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3">
            <div className="text-[11px] font-semibold uppercase text-blue-800 tracking-wider">
              Lowest Output
            </div>
            <div className="text-sm font-bold text-blue-950 font-mono mt-0.5">
              ${data.comparison.cheapestOutput.minPricePerMillion.toFixed(3)}
            </div>
            <div className="text-[11px] text-blue-700 truncate mt-0.5">
              {data.comparison.cheapestOutput.winners.join(", ")}
            </div>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/60 rounded-xl p-3">
            <div className="text-[11px] font-semibold uppercase text-purple-800 tracking-wider">
              Largest Context
            </div>
            <div className="text-sm font-bold text-purple-950 font-mono mt-0.5">
              {formatTokens(data.comparison.largestContext.tokens)}
            </div>
            <div className="text-[11px] text-purple-700 truncate mt-0.5">
              {data.comparison.largestContext.winners.join(", ")}
            </div>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-200/60 rounded-xl p-3">
            <div className="text-[11px] font-semibold uppercase text-indigo-800 tracking-wider">
              Top Intelligence
            </div>
            <div className="text-sm font-bold text-indigo-950 font-mono mt-0.5">
              {data.comparison.highestIntelligence.score}/100
            </div>
            <div className="text-[11px] text-indigo-700 truncate mt-0.5">
              {data.comparison.highestIntelligence.winners.join(", ")}
            </div>
          </div>
        </div>

        {/* Comparison Columns */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-${Math.min(
            data.models.length,
            4
          )} gap-4`}
        >
          {data.models.map((m) => (
            <div
              key={m.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3.5"
            >
              <div>
                <span className="text-[11px] bg-slate-200/80 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {m.lab?.name || "Independent"}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                  {m.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">{m.slug}</p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-200 pt-2.5">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Context</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {m.contextLength ? m.contextLength.toLocaleString() : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Input / 1M</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    ${m.pricing.minPromptPerMillion.toFixed(3)}
                  </span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Output / 1M</span>
                  <span className="font-mono font-semibold text-blue-700">
                    ${m.pricing.minCompletionPerMillion.toFixed(3)}
                  </span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Intelligence</span>
                  <span className="font-mono font-semibold text-indigo-700">
                    {m.benchmark?.intelligenceIndex ?? "—"}/100
                  </span>
                </div>
              </div>

              {/* Capabilities checklist */}
              <div className="pt-2 border-t border-slate-200 text-xs">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Capabilities
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className={m.capabilities.tools ? "text-emerald-600 font-bold" : "text-slate-300"}>
                      {m.capabilities.tools ? "✓" : "✕"}
                    </span>
                    <span className={m.capabilities.tools ? "text-slate-800" : "text-slate-400"}>
                      Function Calling / Tools
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={m.capabilities.vision ? "text-emerald-600 font-bold" : "text-slate-300"}>
                      {m.capabilities.vision ? "✓" : "✕"}
                    </span>
                    <span className={m.capabilities.vision ? "text-slate-800" : "text-slate-400"}>
                      Vision & Multimodal
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={m.capabilities.reasoning ? "text-emerald-600 font-bold" : "text-slate-300"}>
                      {m.capabilities.reasoning ? "✓" : "✕"}
                    </span>
                    <span className={m.capabilities.reasoning ? "text-slate-800" : "text-slate-400"}>
                      Thinking / Reasoning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
