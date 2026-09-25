import { DATE_DURATION_MINUTES } from "./timeRules";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toICSDate(date: Date): string {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeICSText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

interface BuildICSParams {
  title: string;
  start: Date;
  durationMinutes?: number;
  description?: string;
}

export function buildICS({
  title,
  start,
  durationMinutes = DATE_DURATION_MINUTES,
  description = "",
}: BuildICSParams): string {
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const uid = `${start.getTime()}-${Math.random().toString(36).slice(2)}@date-invitation`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//date-invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICSText(title)}`,
  ];
  if (description) lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadICS(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
