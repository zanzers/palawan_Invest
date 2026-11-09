import { SearchProps } from "@/type/DashboardPropsType";
import { Filters } from "@/type/filterType";
import { XIcon } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";


export default function FilterForm({ locations, types, value, onApply, onClose,}: Omit<SearchProps, "dialogRef" | "formKey"> & { onClose: () => void }) {
  const [draft, setDraft] = useState<Filters>(value);

  function onSubmit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); onApply(draft)}

  return (
    <form onSubmit={onSubmit} className="flex max-h-[85dvh] flex-col">
      <header className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-lg font-extrabold tracking-tight">Filters</h2>

        <button type="button" onClick={onClose} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center rounded-full  text-slate-500 hover:bg-black/5">
          <XIcon size={20} />
        </button>

      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <ChipGroup label="Location" anyLabel="Any location" options={locations} value={draft.location} onChange={(location) => setDraft((d) => ({ ...d, location }))}/>
        <ChipGroup label="Property type" anyLabel="All types"  options={types} value={draft.type} onChange={(type) => setDraft((d) => ({ ...d, type }))}/>

        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Max price
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-slate-400">
              ₱
            </span>

            <input inputMode="numeric" placeholder="No limit" value={draft.maxPrice} onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value.replace(/\D/g, "") }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-base font-normal normal-case tracking-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1C2216] focus:ring-2 focus:ring-[#1C2216]/15"/>

          </div>
        </label>
      </div>

      <footer className="flex gap-3 border-t border-slate-100 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => setDraft({ location: "", type: "", maxPrice: "" })} className="rounded-full border border-slate-300 px-5 py-3 text-xs font-bold tracking-wide text-slate-800 hover:bg-slate-50">
          Reset
        </button>
        <button type="submit" className="flex-1 rounded-full bg-[#1C2216] px-5 py-3 text-xs font-bold tracking-wide text-white shadow-lg hover:bg-black">
          Show results
        </button>
      </footer>
    </form>
  );
}



function ChipGroup({ label, anyLabel, options, value, onChange,}: { label: string; anyLabel: string; options: readonly string[]; value: string; onChange: (v: string) => void;}) {
  
const chip = (selected: boolean) =>
    `rounded-full border px-4 py-2 text-xs font-semibold transition ${
      selected
        ? "border-[#1C2216] bg-[#1C2216] text-white"
        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === ""} onClick={() => onChange("")} className={chip(value === "")}>
          {anyLabel}
        </button>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={chip(value === o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}