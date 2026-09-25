"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { sanitizeInstagram } from "@/lib/instagram";

interface Props {
  name: string;
  instagram: string;
  onNameChange: (name: string) => void;
  onInstagramChange: (instagram: string) => void;
  onNext: () => void;
}

export default function StepName({
  name,
  instagram,
  onNameChange,
  onInstagramChange,
  onNext,
}: Props) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const valid = name.trim().length > 0 && instagram.trim().length > 0;

  function handleSubmit() {
    if (submitting || !valid) return;
    // Belt-and-suspenders final clean in case this fires without a prior blur.
    onInstagramChange(sanitizeInstagram(instagram, { final: true }));
    // Locks the button immediately so a fast double click/tap can't fire onNext
    // (and the email send it triggers) twice.
    setSubmitting(true);
    onNext();
  }

  return (
    <div className="flex w-[min(92vw,480px)] flex-col items-center gap-6 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur">
      <h2 className="font-heading text-3xl text-rose-600 sm:text-4xl">{t.name.question}</h2>

      <div className="flex w-full flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.name.placeholder}
          className="min-h-11 w-full rounded-xl border border-rose-200 px-4 py-3 text-center text-lg text-gray-700 outline-none focus:border-rose-400"
        />

        <label className="flex flex-col gap-1 text-left text-sm text-gray-500">
          {t.name.instagramLabel}
          <input
            type="text"
            value={instagram}
            onChange={(e) => onInstagramChange(sanitizeInstagram(e.target.value))}
            onBlur={(e) => onInstagramChange(sanitizeInstagram(e.target.value, { final: true }))}
            placeholder={t.name.instagramPlaceholder}
            className="min-h-11 w-full rounded-xl border border-rose-200 px-4 py-3 text-center text-lg text-gray-700 outline-none focus:border-rose-400"
          />
        </label>
      </div>

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
