import type { ListingDraft } from "@/type/addListing.Type";
import { SAMPLE_DRAFT } from "./sampleDraft";

export type AnalyzeFailure = "quota" | "unavailable" | "unreadable";

export type AnalyzeResult =
  | { ok: true; draft: Partial<ListingDraft> }
  | { ok: false; reason: AnalyzeFailure };

export const FAILURE_MESSAGES: Record<AnalyzeFailure, string> = {
  quota: "The AI quota is used up for today, so the form is empty. Fill it in below.",
  unavailable: "The AI isn't available right now, so the form is empty. Fill it in below.",
  unreadable: "The AI couldn't read that description, so the form is empty. Fill it in below.",
};

// MOCK. Change what this returns to test the manual fallback: "ok", "quota", "unavailable" or "unreadable".
// The real version will send the text to a backend route that asks the LLM. Nothing else will change.
function simulatedOutcome(): "ok" | AnalyzeFailure {
  return "ok";
}

// Never throws: every problem becomes a failure result, so the form can fall back to manual
export async function analyzeListing(text: string): Promise<AnalyzeResult> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const outcome = simulatedOutcome();
    if (outcome !== "ok") return { ok: false, reason: outcome };
    return { ok: true, draft: { ...SAMPLE_DRAFT, description: text } };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}