import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

export const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-[#1C2216] placeholder:text-slate-400 focus:border-[#1C2216] focus:outline-none focus:ring-2 focus:ring-[#1C2216]/10";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl p-4 ">
      <h2 className="text-base font-bold text-[#1C2216]">{title}</h2>
      {children}
    </section>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-slate-600">
      {children}
    </label>
  );
}

export function Select({ id, label, value, onChange, options, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string;}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} appearance-none pr-8 ${value ? "" : "text-slate-400"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <CaretDownIcon
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}