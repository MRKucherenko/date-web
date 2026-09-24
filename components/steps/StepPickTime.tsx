"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/LanguageContext";
import { LOCALE_BY_LANG } from "@/lib/content";
import { getAvailableSlots, parseISODate } from "@/lib/time";

interface Props {
  date: string;
  value: string;
  onSelect: (time: string) => void;
  onNext: () => void;
}

export default function StepPickTime({ date, value, onSelect, onNext }: Props) {
  const { t, lang } = useLanguage();
  const locale = LOCALE_BY_LANG[lang];

  const parsedDate = useMemo(() => parseISODate(date), [date]);
  const slots = useMemo(() => getAvailableSlots(parsedDate), [parsedDate]);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(parsedDate),
    [locale, parsedDate]
  );

  function handlePick(slot: string) {
    onSelect(slot);
    onNext();
  }

  return (
    <div className="flex w-[min(92vw,480px)] flex-col items-center gap-6 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-heading text-3xl text-rose-600 sm:text-4xl">{t.datetime.timeQuestion}</h2>
        <p className="text-sm text-gray-500">{dateLabel}</p>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-gray-500">{t.datetime.noSlots}</p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => {
            const selected = value === slot;
            return (
              <motion.button
                key={slot}
                type="button"
                onClick={() => handlePick(slot)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`min-h-11 rounded-xl border-2 px-2 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-rose-500 bg-rose-50 text-rose-600"
                    : "border-transparent bg-white text-gray-600 hover:border-rose-200"
                }`}
              >
                {slot}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
