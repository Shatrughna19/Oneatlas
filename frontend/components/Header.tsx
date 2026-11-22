"use client";

interface HeaderProps {
  totalCount: number;
  providersCount: number;
}

export function Header({ totalCount, providersCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                OA
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                OneAtlas
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Model Discovery
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Discover, evaluate, and compare 470+ foundation models across all AI labs and providers.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>{totalCount}</strong> Models</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span><strong>{providersCount}</strong> Providers</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
