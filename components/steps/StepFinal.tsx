"use client";

import { useEffect, useMemo } from "react";
import { getActivityLabel } from "@/lib/types";
import type { DateFormData } from "@/lib/types";
import { sendEmail } from "@/lib/sendEmail";
import { interpolate } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";
import ConfettiHearts from "@/components/ui/ConfettiHearts";
import Countdown from "@/components/ui/Countdown";
import { combineDateAndTime } from "@/lib/time";
import { buildICS, downloadICS } from "@/lib/ics";
import type { EmailSendRecord } from "@/components/DateInvitation";

interface Props {
  data: DateFormData;
  emailSend: EmailSendRecord | null;
  onEmailSend: (record: EmailSendRecord) => void;
}

export default function StepFinal({ data, emailSend, onEmailSend }: Props) {
  const { t } = useLanguage();
  const key = useMemo(() => JSON.stringify(data), [data]);
  const target = useMemo(() => combineDateAndTime(data.date, data.time), [data.date, data.time]);

  useEffect(() => {
    // The Back button lets you return here after already sending for the
    // exact same answers (e.g. Back then forward again without changing
    // anything) — skip firing a second real email in that case.
    if (emailSend?.key === key) return;

    let cancelled = false;
    sendEmail(data).then((result) => {
      if (cancelled) return;
      onEmailSend({ key, status: result });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function handleAddToCalendar() {
    const ics = buildICS({
      title: `Date: ${getActivityLabel(t, data.place)}`,
      start: target,
    });
    downloadICS("date.ics", ics);
  }

  return (
    <div className="relative flex w-[min(92vw,520px)] flex-col items-center gap-4 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <ConfettiHearts />

      <h2 className="font-heading text-4xl text-rose-600 sm:text-5xl">{t.final.heading}</h2>
      <p className="text-lg text-gray-700">
        {interpolate(t.final.summaryName, { name: data.name })}{" "}
        <b>{getActivityLabel(t, data.place)}</b>
        <br />
        {interpolate(t.final.summaryWhen, { date: data.date, time: data.time })}
      </p>

      <Countdown target={target} />

      <button
        type="button"
        onClick={handleAddToCalendar}
        className="min-h-11 rounded-full border-2 border-rose-300 px-6 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50"
      >
        {t.final.addToCalendar}
      </button>
    </div>
  );
}
