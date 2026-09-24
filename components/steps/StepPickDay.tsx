"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/LanguageContext";
import { LOCALE_BY_LANG } from "@/lib/content";
import { getAvailableDays, toISODate } from "@/lib/time";

interface Props {
  value: string;
  onSelect: (date: string) => void;
  onNext: () => void;
}

export default function StepPickDay({ value, onSelect, onNext }: Props) {
  const { t, lang } = useLanguage();
  const locale = LOCALE_BY_LANG[lang];
  const days = useMemo(() => getAvailableDays(), []);

  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale]
  );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
    [locale]
  );

  function handlePick(date: Date) {
    onSelect(toISODate(date));
    onNext();
  }

  return (
    <div className="flex w-[min(92vw,560px)] flex-col items-center gap-6 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <h2 className="font-heading text-3xl text-rose-600 sm:text-4xl">{t.datetime.dayQuestion}</h2>

      <div className="grid max-h-80 w-full grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
        {days.map((date) => {
          const iso = toISODate(date);
          const selected = value === iso;
          return (
            <motion.button
              key={iso}
              type="button"
              onClick={() => handlePick(date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-2 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-rose-500 bg-rose-50 text-rose-600"
                  : "border-transparent bg-white text-gray-600 hover:border-rose-200"
              }`}
            >
              <span className="text-[11px] uppercase text-gray-400">
                {weekdayFormatter.format(date)}
              </span>
              <span>{dayFormatter.format(date)}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
