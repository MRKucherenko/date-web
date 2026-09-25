import type { Activity, DateFormData, EmailSendRecord } from "./types";
import { ACTIVITY_IDS } from "./types";
import { STEP_ASK, STEP_COUNT } from "./steps";
import { combineDateAndTime } from "./time";
import { DATE_DURATION_MINUTES } from "./timeRules";

// Versioned so a future change to the saved shape can't be misread as valid
// data from an older build — just bump the suffix and old sessions quietly
// stop matching instead of crashing anything.
const STORAGE_KEY = "date-invite-state-v1";

export const INITIAL_FORM: DateFormData = {
  place: null,
  date: "",
  time: "",
  name: "",
  instagram: "",
};

export interface PersistedState {
  step: number;
  form: DateFormData;
  emailSend: EmailSendRecord | null;
}

function isValidActivity(value: unknown): value is Activity | null {
  if (value === null) return true;
  return typeof value === "string" && (ACTIVITY_IDS as string[]).includes(value);
}

function isValidEmailSend(value: unknown): value is EmailSendRecord | null {
  if (value === null) return true;
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.key === "string" &&
    (record.status === "sent" || record.status === "skipped" || record.status === "error")
  );
}

function isValidPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;

  if (
    typeof state.step !== "number" ||
    !Number.isInteger(state.step) ||
    state.step < STEP_ASK ||
    state.step > STEP_COUNT - 1
  ) {
    return false;
  }

  const form = state.form;
  if (!form || typeof form !== "object") return false;
  const f = form as Record<string, unknown>;
  if (!isValidActivity(f.place)) return false;
  if (typeof f.date !== "string") return false;
  if (typeof f.time !== "string") return false;
  if (typeof f.name !== "string") return false;
  if (typeof f.instagram !== "string") return false;

  if (!isValidEmailSend(state.emailSend)) return false;

  return true;
}

/** True once the date (plus DATE_DURATION_MINUTES) is behind us. */
function isExpired(form: DateFormData, now: Date): boolean {
  if (!form.date || !form.time) return false;
  const start = combineDateAndTime(form.date, form.time);
  const end = new Date(start.getTime() + DATE_DURATION_MINUTES * 60_000);
  return end.getTime() <= now.getTime();
}

export function loadState(now: Date = new Date()): PersistedState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidPersistedState(parsed)) {
      clearState();
      return null;
    }

    if (isExpired(parsed.form, now)) {
      clearState();
      return null;
    }

    return parsed;
  } catch {
    // Corrupt JSON, or localStorage unavailable (e.g. private browsing) —
    // degrade to a fresh session instead of throwing.
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled — just don't persist this time.
  }
}

export function clearState(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
