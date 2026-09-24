"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { getCountdown } from "@/lib/countdown";
import { countdownUnitLabel, interpolate } from "@/lib/content";

interface Props {
  target: Date;
}

export default function Countdown({ target }: Props) {
  const { t, lang } = useLanguage();
  const [parts, setParts] = useState(() => getCountdown(target));

  useEffect(() => {
    const id = setInterval(() => {
      setParts(getCountdown(target));
    }, 60_000);
    return () => clearInterval(id);
  }, [target]);

  if (parts.arrived) {
    return <p className="text-sm font-medium text-rose-500">{t.final.countdownArrived}</p>;
  }

  const segments: string[] = [];
  if (parts.days > 0) {
    segments.push(`${parts.days} ${countdownUnitLabel(lang, "day", parts.days)}`);
  }
  if (parts.days > 0 || parts.hours > 0) {
    segments.push(`${parts.hours} ${countdownUnitLabel(lang, "hour", parts.hours)}`);
  }
  segments.push(`${parts.minutes} ${countdownUnitLabel(lang, "minute", parts.minutes)}`);

  return (
    <p className="text-sm font-medium text-rose-500">
      {interpolate(t.final.countdownTemplate, { parts: segments.join(" ") })}
    </p>
  );
}
