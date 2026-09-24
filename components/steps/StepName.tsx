"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

export default function StepName({ value, onChange, onNext }: Props) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const valid = value.trim().length > 0;

  function handleSubmit() {
    if (submitting || !valid) return;
    // Locks the button immediately so a fast double click/tap can't fire onNext
    // (and the email send it triggers) twice.
    setSubmitting(true);
    onNext();
  }

  return (
    <div className="flex w-[min(92vw,480px)] flex-col items-center gap-6 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <h2 className="font-heading text-3xl text-rose-600 sm:text-4xl">{t.name.question}</h2>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.name.placeholder}
        className="min-h-11 w-full rounded-xl border border-rose-200 px-4 py-3 text-center text-lg text-gray-700 outline-none focus:border-rose-400"
      />

      <button
        type="button"
        disabled={!valid || submitting}
        onClick={handleSubmit}
        className="min-h-11 rounded-full bg-rose-500 px-10 py-3 font-semibold text-white shadow-lg shadow-rose-300 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.name.submit}
      </button>
    </div>
  );
}
