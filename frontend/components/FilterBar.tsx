"use client";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (val: "asc" | "desc") => void;
  filterTools: boolean;
  onFilterToolsChange: (val: boolean) => void;
  filterVision: boolean;
  onFilterVisionChange: (val: boolean) => void;
  filterReasoning: boolean;
  onFilterReasoningChange: (val: boolean) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (val: "grid" | "table") => void;
  onResetFilters: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortByChange,
  filterTools,
  onFilterToolsChange,
  filterVision,
  onFilterVisionChange,
  filterReasoning,
  onFilterReasoningChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
}: FilterBarProps) {
  const isFiltering =
    Boolean(search) ||
    Boolean(selectedType) ||
    filterTools ||
    filterVision ||
    filterReasoning;

  const categories = [
    { label: "All Models", value: "" },
    { label: "Reasoning", value: "reasoning" },
    { label: "Vision", value: "multimodal" },
    { label: "Code", value: "code" },
    { label: "Chat", value: "chat" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search 470+ models by name, creator lab (e.g. OpenAI, Anthropic), or keywords..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-sm pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm placeholder:text-slate-400 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Category Pills & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedType === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => onTypeChange(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          <span className="text-slate-300 mx-1">|</span>

          {/* Quick Capability Toggles */}
          <button
            onClick={() => onFilterToolsChange(!filterTools)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterTools
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Tools {filterTools ? "✓" : ""}
          </button>

          <button
            onClick={() => onFilterVisionChange(!filterVision)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterVision
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Vision {filterVision ? "✓" : ""}
          </button>

          <button
            onClick={() => onFilterReasoningChange(!filterReasoning)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterReasoning
                ? "bg-purple-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Thinking {filterReasoning ? "✓" : ""}
          </button>
        </div>

        {/* Right side controls: Sort & View Mode */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Clean Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="intelligence">Highest Intelligence</option>
            <option value="price">Lowest Price</option>
            <option value="context">Largest Context</option>
            <option value="releasedate">Newest Release</option>
            <option value="name">Alphabetical</option>
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              Grid
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "table"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              List
            </button>
          </div>

          {isFiltering && (
            <button
              onClick={onResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
