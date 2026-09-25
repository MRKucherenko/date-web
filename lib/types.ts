import type { content } from "./content";
import type { SendResult } from "./sendEmail";

export type Activity =
  | "cinema"
  | "cafe"
  | "walk"
  | "dinner"
  | "bowling"
  | "exhibition"
  | "coffee";

export interface DateFormData {
  place: Activity | null;
  date: string;
  time: string;
  name: string;
  instagram: string;
}

export interface EmailSendRecord {
  key: string;
  status: SendResult;
}

export const ACTIVITY_IDS: Activity[] = [
  "cinema",
  "cafe",
  "walk",
  "dinner",
  "bowling",
  "exhibition",
  "coffee",
];

export const ACTIVITY_EMOJI: Record<Activity, string> = {
  cinema: "🎬",
  cafe: "🍰",
  walk: "🚶",
  dinner: "🍽️",
  bowling: "🎳",
  exhibition: "🖼️",
  coffee: "☕",
};

export function getActivityLabel(
  t: (typeof content)["en"],
  id: Activity | null
): string {
  if (!id) return t.common.unset;
  return t.activity.options[id].label;
}
