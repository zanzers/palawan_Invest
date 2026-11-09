"use client";

import { MagnifyingGlassIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import FilterSheet from "./FilterSheet";
import { useSearchFilters } from "./DashboardFunctions"; // adjust the path to where the file lives
import { PropsLocations } from "@/type/DashboardPropsType";


export default function SearchBar({ locations, types }: PropsLocations) {
  const { q, setQ, filters, activeCount, sheetRef, openId, pushSearch, onSubmitSearch, openSheet } = useSearchFilters();

   return (
    <div>
      <form onSubmit={onSubmitSearch} role="search">
        <div className="flex h-12 items-center rounded-full border border-slate-200 bg-white pl-4 pr-1.5 transition has-[input:focus]:border-[#1C2216] has-[input:focus]:ring-2 has-[input:focus]:ring-[#1C2216]/15">
          <MagnifyingGlassIcon size={20} aria-hidden="true" className="shrink-0 text-slate-400" />

          <label className="min-w-0 flex-1">
            <span className="sr-only">Search listings</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search location or title" enterKeyHint="search" className="h-10 w-full bg-transparent px-3 text-base text-slate-900 outline-none placeholder:text-slate-400 md:text-sm"/>
          </label>

          <button type="button" onClick={openSheet} aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"} className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C2216] text-white transition active:scale-95">

            <SlidersHorizontalIcon size={20} aria-hidden="true" />
                {activeCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {activeCount}
                </span>
                )}
          </button>
        </div>
      </form>

      <FilterSheet dialogRef={sheetRef} formKey={openId} locations={locations} types={types} value={filters} onApply={(f) => pushSearch(f)}/>
    </div>
  );
}