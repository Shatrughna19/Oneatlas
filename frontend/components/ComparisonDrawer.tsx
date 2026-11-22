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
    <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-200 px-2 py-0.5 rounded">
            Comparison Lab ({selectedCount}/4)
          </span>
          <p className="text-sm text-indigo-900 font-medium">
            {selectedCount < 2
              ? "Select at least one more model to enable side-by-side comparison"
              : "Ready for comparison! Click Compare to run full multi-dimensional evaluation."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCompare}
            disabled={selectedCount < 2 || loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {loading ? "Analyzing..." : `Compare ${selectedCount} Models`}
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}
    </section>
  );
}
