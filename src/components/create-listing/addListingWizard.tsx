"use client";

import { SAMPLE_DRAFT } from "./sampleDraft";
import StageIndicator from "./StageIndicator";
import { STEPS, STEP_COMPONENTS } from "./steps";
import { useListingForm } from "./useListingForm";

function labelFor(key: string) {
  const unit = key.match(/^units\.(\d+)\.(.+)$/);
  const base = unit ? `Unit ${Number(unit[1]) + 1} ${unit[2]}` : key;
  const text = base.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const primary = "rounded-full bg-[#1C2216] px-6 py-3 text-xs font-bold tracking-wide text-white shadow-lg transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold tracking-wide text-slate-800 transition hover:bg-slate-50 active:scale-[0.98]";

export default function AddListingWizard() {
  const form = useListingForm();
  const { step, finished, direction, errors, aiFilled, notice } = form;
  const StepComponent = STEP_COMPONENTS[step];
  const problems = Object.entries(errors);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <StageIndicator steps={STEPS} current={finished ? STEPS.length + 1 : step} onSelect={form.goTo} />

      {!finished && step > 1 && (aiFilled || notice) && (
        <p
          role="status"
          className={`mt-4 rounded-2xl p-3 text-xs font-medium ${
            aiFilled ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
          }`}
        >
          {aiFilled ? "Filled from your description. Check each stage, then create the listing." : notice}
        </p>
      )}

      {/* key remounts the block, so the slide plays on every stage change */}
      <div key={finished ? "review" : step} className={`mt-6 ${direction === "forward" ? "step-forward" : "step-back"}`}>
        {finished ? (
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Review</h2>
            <p className="mt-1 text-sm text-slate-500">This is what will be saved. Creating the listing comes with the backend.</p>
            <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-100">
              {JSON.stringify(form.payload, null, 2)}
            </pre>
          </div>
        ) : (
          <StepComponent form={form} />
        )}
      </div>

      {problems.length > 0 && (
        <div role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <ul className="list-disc space-y-1 pl-5">
            {problems.map(([key, message]) => (
              <li key={key}>
                {labelFor(key)}: {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 1 || finished ? (
          <button type="button" onClick={form.back} className={secondary}>
            Back
          </button>
        ) : (
          <span />
        )}

        {finished ? (
          <button type="button" disabled className={primary} title="Comes with the backend">
            Create listing
          </button>
        ) : step === 1 ? null : (
          <button type="button" onClick={form.next} className={primary}>
            {step === STEPS.length ? "Review" : "Next"}
          </button>
        )}
      </div>

      {process.env.NODE_ENV !== "production" && (
        <button
          type="button"
          onClick={() => form.update(SAMPLE_DRAFT)}
          className="mt-4 text-xs font-semibold text-slate-400 underline hover:text-slate-600"
        >
          Fill sample data (dev only)
        </button>
      )}
    </section>
  );
}