"use client";

import { motion } from "motion/react";
import { ACTIVITY_EMOJI, ACTIVITY_IDS } from "@/lib/types";
import type { Activity } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  value: Activity | null;
  onSelect: (activity: Activity) => void;
  onNext: () => void;
}

export default function StepChooseActivity({ value, onSelect, onNext }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex w-[min(92vw,560px)] flex-col items-center gap-8 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <h2 className="font-heading text-3xl text-rose-600 sm:text-4xl">{t.activity.question}</h2>

      <div className="grid w-full grid-cols-2 gap-4">
        {ACTIVITY_IDS.map((id) => {
          const selected = value === id;
          const option = t.activity.options[id];
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex min-h-11 flex-col items-center gap-1 rounded-2xl border-2 p-4 text-lg font-medium transition-colors ${
                selected
                  ? "border-rose-500 bg-rose-50 text-rose-600"
                  : "border-transparent bg-white text-gray-600 hover:border-rose-200"
              }`}
            >
              <span className="text-3xl">{ACTIVITY_EMOJI[id]}</span>
              <span>{option.label}</span>
              <span
                className={`text-xs font-normal ${selected ? "text-rose-400" : "text-gray-400"}`}
              >
                {option.hint}
              </span>
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!value}
        onClick={onNext}
        className="min-h-11 rounded-full bg-rose-500 px-10 py-3 font-semibold text-white shadow-lg shadow-rose-300 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.common.next}
      </button>
    </div>
  );
}
