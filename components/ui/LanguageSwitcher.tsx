"use client";

import { LANGS } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-white/70 p-1 text-xs font-medium text-gray-500 shadow backdrop-blur">
      {LANGS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          className={`rounded-full px-2 py-1 uppercase transition-colors ${
            lang === option ? "bg-rose-500 text-white" : "hover:text-rose-500"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
