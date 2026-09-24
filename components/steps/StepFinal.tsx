"use client";

import { useEffect, useMemo, useState } from "react";
import { getActivityLabel } from "@/lib/types";
import type { DateFormData } from "@/lib/types";
import { sendEmail } from "@/lib/sendEmail";
import type { SendResult } from "@/lib/sendEmail";
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

type Status = "sending" | SendResult;

export default function StepFinal({ data, emailSend, onEmailSend }: Props) {
  const { t } = useLanguage();
  const key = useMemo(() => JSON.stringify(data), [data]);
  const [status, setStatus] = useState<Status>(
    emailSend?.key === key ? emailSend.status : "sending"
  );
  const target = useMemo(() => combineDateAndTime(data.date, data.time), [data.date, data.time]);

  useEffect(() => {
    // The Back button lets you return here after already sending for the
    // exact same answers (e.g. Back then forward again without changing
    // anything) — the lazy useState above already picked up that cached
    // result, so just skip firing a second real email.
    if (emailSend?.key === key) return;

    // No cached result for this key — the lazy useState above already
    // defaulted to "sending" for this case.
    let cancelled = false;
    sendEmail(data).then((result) => {
      if (cancelled) return;
      setStatus(result);
      onEmailSend({ key, status: result });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function handleRetry() {
    // Button that triggers this unmounts while status is "sending" (see below),
    // so a second click can't fire a second request.
    setStatus("sending");
    sendEmail(data).then((result) => {
      setStatus(result);
      onEmailSend({ key, status: result });
    });
  }

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

      <p className="text-sm text-gray-400">
        {status === "sending" && t.final.statusSending}
        {status === "sent" && t.final.statusSent}
        {status === "skipped" && t.final.statusSkipped}
        {status === "error" && t.final.statusError}
      </p>

      {status === "error" && (
        <button
          type="button"
          onClick={handleRetry}
          className="min-h-11 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-rose-300 hover:bg-rose-600"
        >
          {t.final.sendAgain}
        </button>
      )}
    </div>
  );
}
