import type { Activity } from "./types";

export type Lang = "en" | "ru";

export const LANGS: Lang[] = ["en", "ru"];
export const DEFAULT_LANG: Lang = "en";

export const LOCALE_BY_LANG: Record<Lang, string> = {
  en: "en-US",
  ru: "ru-RU",
};

interface ContentShape {
  common: {
    next: string;
    back: string;
    unset: string;
  };
  askOut: {
    question: string;
    yes: string;
    no: string;
    hint: string;
    notAccepted: string;
  };
  activity: {
    question: string;
    options: Record<Activity, { label: string; hint: string }>;
  };
  datetime: {
    dayQuestion: string;
    timeQuestion: string;
    noSlots: string;
  };
  name: {
    question: string;
    placeholder: string;
    instagramPlaceholder: string;
    submit: string;
  };
  final: {
    heading: string;
    summaryName: string;
    summaryWhen: string;
    countdownTemplate: string;
    countdownArrived: string;
    addToCalendar: string;
  };
}

export const content: Record<Lang, ContentShape> = {
  en: {
    common: {
      next: "Next →",
      back: "← Back",
      unset: "—",
    },
    askOut: {
      question: "Will you go on a date with me? 💌",
      yes: "Yes ❤️",
      no: "No",
      hint: "Maybe yes after all? 🥺",
      notAccepted: "Nice try — that answer's not accepted 😏",
    },
    activity: {
      question: "Where should we go? 🌹",
      options: {
        cinema: { label: "Cinema", hint: "Movie night" },
        cafe: { label: "Café", hint: "Sit down & talk" },
        walk: { label: "Walk", hint: "Stroll together" },
        dinner: { label: "Dinner", hint: "A proper meal" },
        bowling: { label: "Bowling", hint: "Game night" },
        exhibition: { label: "Exhibition", hint: "Art & culture" },
        coffee: { label: "Coffee", hint: "Quick catch-up" },
      },
    },
    datetime: {
      dayQuestion: "When are you free? 📅",
      timeQuestion: "Pick a time ⏰",
      noSlots: "No times left for this day — try another one.",
    },
    name: {
      question: "What's your name? 💕",
      placeholder: "Your name",
      instagramPlaceholder: "@username",
      submit: "Done 🎉",
    },
    final: {
      heading: "Yay! 🎉",
      summaryName: "{name}, you picked",
      summaryWhen: "{date} at {time}",
      countdownTemplate: "{parts} left",
      countdownArrived: "It's happening today! 💕",
      addToCalendar: "Add to calendar 📅",
    },
  },
  ru: {
    common: {
      next: "Далее →",
      back: "← Назад",
      unset: "—",
    },
    askOut: {
      question: "Ты пойдёшь со мной на свидание? 💌",
      yes: "Да ❤️",
      no: "Нет",
      hint: "Может всё-таки да? 🥺",
      notAccepted: "Хорошая попытка — этот ответ не принимается 😏",
    },
    activity: {
      question: "Куда сходим? 🌹",
      options: {
        cinema: { label: "Кино", hint: "Вечер в кинотеатре" },
        cafe: { label: "Кафе", hint: "Посидеть подольше" },
        walk: { label: "Прогулка", hint: "Погулять вместе" },
        dinner: { label: "Ужин", hint: "Полноценно поесть" },
        bowling: { label: "Боулинг", hint: "Игровой вечер" },
        exhibition: { label: "Выставка", hint: "Искусство и культура" },
        coffee: { label: "Кофе", hint: "Быстрая встреча" },
      },
    },
    datetime: {
      dayQuestion: "Когда ты свободна? 📅",
      timeQuestion: "Выбери время ⏰",
      noSlots: "На этот день свободного времени не осталось — выбери другой день.",
    },
    name: {
      question: "Как тебя зовут? 💕",
      placeholder: "Твоё имя",
      instagramPlaceholder: "@ник",
      submit: "Готово 🎉",
    },
    final: {
      heading: "Ураа! 🎉",
      summaryName: "{name}, ты выбрала",
      summaryWhen: "{date} в {time}",
      countdownTemplate: "Осталось: {parts}",
      countdownArrived: "Этот день настал! 💕",
      addToCalendar: "Добавить в календарь 📅",
    },
  },
};

export function countdownUnitLabel(
  lang: Lang,
  unit: "day" | "hour" | "minute",
  n: number
): string {
  if (lang === "en") {
    const forms: Record<typeof unit, [string, string]> = {
      day: ["day", "days"],
      hour: ["hour", "hours"],
      minute: ["minute", "minutes"],
    };
    return n === 1 ? forms[unit][0] : forms[unit][1];
  }

  const forms: Record<typeof unit, [string, string, string]> = {
    day: ["день", "дня", "дней"],
    hour: ["час", "часа", "часов"],
    minute: ["минута", "минуты", "минут"],
  };
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[unit][2];
  if (mod10 === 1) return forms[unit][0];
  if (mod10 >= 2 && mod10 <= 4) return forms[unit][1];
  return forms[unit][2];
}

export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
