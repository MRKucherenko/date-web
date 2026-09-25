"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import StepAskOut from "./steps/StepAskOut";
import StepChooseActivity from "./steps/StepChooseActivity";
import StepPickDay from "./steps/StepPickDay";
import StepPickTime from "./steps/StepPickTime";
import StepName from "./steps/StepName";
import StepFinal from "./steps/StepFinal";
import ProgressDots from "./ui/ProgressDots";
import LanguageSwitcher from "./ui/LanguageSwitcher";
import BackButton from "./ui/BackButton";
import { LanguageProvider } from "@/lib/LanguageContext";
import type { DateFormData, EmailSendRecord } from "@/lib/types";
import { STEP_ACTIVITY, STEP_ASK, STEP_COUNT, STEP_DAY, STEP_FINAL, STEP_NAME, STEP_TIME } from "@/lib/steps";
import { INITIAL_FORM, loadState, saveState } from "@/lib/persistence";

const stepTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.28, ease: "easeOut" as const },
};

// Very faint noise so the gradient doesn't look flat/plasticky.
const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function DateInvitation() {
  const [step, setStep] = useState(STEP_ASK);
  const [form, setForm] = useState<DateFormData>(INITIAL_FORM);
  // Lifted above StepFinal so that navigating back to it (via the Back
  // button) and forward again doesn't silently fire a second real email —
  // see StepFinal for how the key is used to skip a redundant auto-send.
  const [emailSend, setEmailSend] = useState<EmailSendRecord | null>(null);
  // Guards the initial paint against a hydration mismatch: server and the
  // client's first render both show nothing here, then this effect restores
  // whatever was saved (if anything) before the real UI appears.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from an external source (localStorage) on mount — the
    // documented exception to "don't setState in an effect".
    const saved = loadState();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(saved.step);
      setForm(saved.form);
      setEmailSend(saved.emailSend);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ step, form, emailSend });
  }, [hydrated, step, form, emailSend]);

  function next() {
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, STEP_ASK));
  }

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 p-4">
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
            style={{ backgroundImage: NOISE_BACKGROUND }}
          />

          {hydrated && (
            <>
              <LanguageSwitcher />
              {step > STEP_ASK && <BackButton onClick={back} />}
              {step > STEP_ASK && step < STEP_COUNT - 1 && (
                <ProgressDots total={STEP_COUNT - 1} current={step} />
              )}

              <AnimatePresence mode="wait">
                {step === STEP_ASK && (
                  <motion.div key="ask" {...stepTransition}>
                    <StepAskOut onYes={next} />
                  </motion.div>
                )}

                {step === STEP_ACTIVITY && (
                  <motion.div key="activity" {...stepTransition}>
                    <StepChooseActivity
                      value={form.place}
                      onSelect={(place) => setForm((f) => ({ ...f, place }))}
                      onNext={next}
                    />
                  </motion.div>
                )}

                {step === STEP_DAY && (
                  <motion.div key="day" {...stepTransition}>
                    <StepPickDay
                      value={form.date}
                      onSelect={(date) => setForm((f) => ({ ...f, date, time: "" }))}
                      onNext={next}
                    />
                  </motion.div>
                )}

                {step === STEP_TIME && (
                  <motion.div key="time" {...stepTransition}>
                    <StepPickTime
                      date={form.date}
                      value={form.time}
                      onSelect={(time) => setForm((f) => ({ ...f, time }))}
                      onNext={next}
                    />
                  </motion.div>
                )}

                {step === STEP_NAME && (
                  <motion.div key="name" {...stepTransition}>
                    <StepName
                      name={form.name}
                      instagram={form.instagram}
                      onNameChange={(name) => setForm((f) => ({ ...f, name }))}
                      onInstagramChange={(instagram) => setForm((f) => ({ ...f, instagram }))}
                      onNext={next}
                    />
                  </motion.div>
                )}

                {step === STEP_FINAL && (
                  <motion.div key="final" {...stepTransition}>
                    <StepFinal data={form} emailSend={emailSend} onEmailSend={setEmailSend} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </main>
      </MotionConfig>
    </LanguageProvider>
  );
}
