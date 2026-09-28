import type { content } from "./content";
import type { SendResult } from "./sendEmail";

export type Activity =
  | "cinema"
  | "breakfast"
  | "walk"
  | "dinner"
  | "bowling"
  | "exhibition"
  | "coffee"
  | "drinks";

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
  "breakfast",
  "walk",
  "dinner",
  "bowling",
  "exhibition",
  "coffee",
  "drinks",
];

export const ACTIVITY_EMOJI: Record<Activity, string> = {
  cinema: "🎬",
  breakfast: "🥞",
  walk: "🚶",
  dinner: "🍽️",
  bowling: "🎳",
  exhibition: "🖼️",
  coffee: "☕",
  drinks: "🍸",
};

export function getActivityLabel(
  t: (typeof content)["en"],
  id: Activity | null
): string {
  if (!id) return t.common.unset;
  return t.activity.options[id].label;
}
