"use client";

import { StepId } from "@/type/addListing.Type";
import { CheckIcon } from "@phosphor-icons/react";



type Props = { steps: readonly { id: number; label: string }[]; current: number;  onSelect: (id: StepId) => void;};

export default function StageIndicator({ steps, current, onSelect }: Props) {
  const label = steps.find((s) => s.id === current)?.label ?? "Review";

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((s, i) => {
          const done = s.id < current;
          const active = s.id === current;
          const last = i === steps.length - 1;

          return (
            <li key={s.id} className={`flex items-center ${last ? "" : "flex-1"}`}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onSelect(s.id as StepId)}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${s.id}: ${s.label}${done ? " (completed)" : ""}`}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  done
                    ? "bg-[#1C2216] text-white hover:bg-black"
                    : active
                      ? "border-2 border-[#1C2216] bg-white text-[#1C2216]"
                      : "border border-slate-300 bg-white text-slate-400"
                }`}
              >
                {done ? <CheckIcon size={16} weight="bold" aria-hidden="true" /> : s.id}
              </button>
              {!last && (
                <span
                  aria-hidden="true"
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${done ? "bg-[#1C2216]" : "bg-slate-200"}`}
                />
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        {current > steps.length ? "Review" : `Step ${current} of ${steps.length} · ${label}`}
      </p>
    </nav>
  );
}