"use client";

interface HeaderProps {
  totalCount: number;
  providersCount: number;
  currentPage: number;
  totalPages: number;
}

export function Header({
  totalCount,
  providersCount,
  currentPage,
  totalPages,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              ONEATLAS.DEV
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Model Intelligence Platform
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Discover, evaluate, compare, and benchmark foundation models across all AI research labs and inference providers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
          <span>Catalog: <strong className="text-slate-900 font-mono">{totalCount}</strong></span>
          <span className="text-slate-300">|</span>
          <span>Providers: <strong className="text-slate-900 font-mono">{providersCount}</strong></span>
          <span className="text-slate-300">|</span>
          <span>Page: <strong className="text-slate-900 font-mono">{currentPage}/{totalPages}</strong></span>
        </div>
      </div>
    </header>
  );
}
