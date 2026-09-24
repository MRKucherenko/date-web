import {
  MAX_DAYS_AHEAD,
  SLOT_STEP_MINUTES,
  WEEKDAY_END_MINUTES,
  WEEKDAY_START_MINUTES,
  WEEKEND_END_MINUTES,
  WEEKEND_START_MINUTES,
} from "./timeRules";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getDayMinuteRange(date: Date): { start: number; end: number } {
  return isWeekend(date)
    ? { start: WEEKEND_START_MINUTES, end: WEEKEND_END_MINUTES }
    : { start: WEEKDAY_START_MINUTES, end: WEEKDAY_END_MINUTES };
}

export function minutesToLabel(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function combineDateAndTime(dateISO: string, time: string): Date {
  const date = parseISODate(dateISO);
  const [h, m] = time.split(":").map(Number);
  date.setHours(h || 0, m || 0, 0, 0);
  return date;
}

/** Today plus up to MAX_DAYS_AHEAD days, at local midnight. */
export function getAvailableDays(now: Date = new Date()): Date[] {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days: Date[] = [];
  for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

/** "HH:mm" slots for a given day, excluding already-past times when the day is today. */
export function getAvailableSlots(date: Date, now: Date = new Date()): string[] {
  const { start, end } = getDayMinuteRange(date);
  const today = isSameDay(date, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  for (let m = start; m <= end; m += SLOT_STEP_MINUTES) {
    if (today && m <= nowMinutes) continue;
    slots.push(minutesToLabel(m));
  }
  return slots;
}
