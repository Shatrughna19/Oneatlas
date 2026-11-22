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
  onResetFilters: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  filterTools,
  onFilterToolsChange,
  filterVision,
  onFilterVisionChange,
  filterReasoning,
  onFilterReasoningChange,
  onResetFilters,
}: FilterBarProps) {
  const isFiltering =
    Boolean(search) ||
    Boolean(selectedType) ||
    filterTools ||
    filterVision ||
    filterReasoning;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="search-models-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Search Models / Labs
          </label>
          <input
            id="search-models-input"
            type="text"
            placeholder="Search by name, slug, lab, or keywords..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="filter-model-type"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Model Category
          </label>
          <select
            id="filter-model-type"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="chat">Chat / Conversational</option>
            <option value="reasoning">Reasoning / Thinking</option>
            <option value="code">Code Specialists</option>
            <option value="multimodal">Multimodal / Vision</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-attribute-select"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Sort Attribute
          </label>
          <select
            id="sort-attribute-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="intelligence">Intelligence Index (Highest)</option>
            <option value="price">Pricing ($ / 1M Tokens)</option>
            <option value="context">Context Window (Tokens)</option>
            <option value="releasedate">Release Date</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-direction-select"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Sort Direction
          </label>
          <select
            id="sort-direction-select"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="desc">Descending (High to Low)</option>
            <option value="asc">Ascending (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Capability Toggles */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
        <span className="font-semibold text-slate-600">Filter Capabilities:</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filterTools}
            onChange={(e) => onFilterToolsChange(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span>Function Calling / Tools</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filterVision}
            onChange={(e) => onFilterVisionChange(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span>Vision / Multimodal</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filterReasoning}
            onChange={(e) => onFilterReasoningChange(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span>Reasoning / Thinking</span>
        </label>

        {isFiltering && (
          <button
            onClick={onResetFilters}
            className="ml-auto text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </section>
  );
}
