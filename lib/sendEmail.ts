"use client";

import emailjs from "@emailjs/browser";
import type { DateFormData } from "./types";
import { content } from "./content";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Notification always lands in the site owner's own inbox, regardless of
// who is filling out the form.
const OWNER_EMAIL = "databasepeople9@gmail.com";

export type SendResult = "sent" | "skipped" | "error";

/** "12 October, 19:30" — always en-GB, independent of the visitor's UI language. */
function formatWhen(dateISO: string, time: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  }).format(date);
  return `${dateLabel}, ${time}`;
}

export async function sendEmail(data: DateFormData): Promise<SendResult> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      "[sendEmail] EmailJS env vars are missing (NEXT_PUBLIC_EMAILJS_SERVICE_ID / " +
        "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID / NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) — see " +
        ".env.local.example. Email was not sent.",
      data
    );
    return "skipped";
  }

  try {
    // Template variables: email, date_type, when, instagram, name.
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        email: OWNER_EMAIL,
        date_type: data.place
          ? content.en.activity.options[data.place].label
          : content.en.common.unset,
        when: formatWhen(data.date, data.time),
        instagram: data.instagram,
        name: data.name,
      },
      { publicKey: PUBLIC_KEY }
    );
    return "sent";
  } catch (err) {
    console.error("[sendEmail] EmailJS request failed", err);
    return "error";
  }
}
