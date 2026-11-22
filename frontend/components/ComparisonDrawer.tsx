"use client";

interface ComparisonDrawerProps {
  selectedCount: number;
  loading: boolean;
  onCompare: () => void;
  onClear: () => void;
  errorMessage: string | null;
}

export function ComparisonDrawer({
  selectedCount,
  loading,
  onCompare,
  onClear,
  errorMessage,
}: ComparisonDrawerProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-xl border border-slate-700/80 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 pl-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <div>
            <div className="text-xs font-semibold">
              {selectedCount} model{selectedCount > 1 ? "s" : ""} selected
            </div>
            <div className="text-[11px] text-slate-400">
              {selectedCount < 2 ? "Select at least 1 more to compare" : "Ready for comparison"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={selectedCount < 2 || loading}
            className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {loading ? "Comparing..." : "Compare Now →"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-2 text-center text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 shadow-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
