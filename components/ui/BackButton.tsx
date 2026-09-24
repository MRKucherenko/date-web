"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  onClick: () => void;
}

export default function BackButton({ onClick }: Props) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-4 left-4 z-20 min-h-11 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-gray-500 shadow backdrop-blur transition-colors hover:text-rose-500"
    >
      {t.common.back}
    </button>
  );
}
