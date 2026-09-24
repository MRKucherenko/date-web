"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface Props {
  onYes: () => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const STAGE_PADDING = 16;
const PROXIMITY_RADIUS = 130; // desktop: dodge once the cursor gets this close
const PUSH_DISTANCE = 90; // px pushed per dodge
const DODGE_COOLDOWN = 220; // ms, avoids re-triggering every pointermove frame
const MAX_ATTEMPTS = 6;

function clamp(value: number, min: number, max: number) {
  if (min > max) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
}

export default function StepAskOut({ onYes }: Props) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const naturalRect = useRef<Rect | null>(null);
  const lastDodgeAt = useRef(0);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [caught, setCaught] = useState(false);

  const noScale = Math.max(0.35, 1 - attempts * 0.12);
  const yesScale = Math.min(2.2, 1 + attempts * 0.18);
  // Cursor-chasing/touch-dodging is a motion effect — skip it entirely under
  // prefers-reduced-motion instead of just softening the animation.
  const canDodge = !reducedMotion && attempts < MAX_ATTEMPTS;

  // Measure the button's untransformed position relative to the stage, once.
  useEffect(() => {
    const stage = stageRef.current;
    const btn = noBtnRef.current;
    if (!stage || !btn) return;
    const stageRect = stage.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    naturalRect.current = {
      left: btnRect.left - stageRect.left,
      top: btnRect.top - stageRect.top,
      width: btnRect.width,
      height: btnRect.height,
    };
  }, []);

  function dodge(cursorX: number, cursorY: number) {
    const stage = stageRef.current;
    const natural = naturalRect.current;
    if (!stage || !natural || !canDodge) return;

    const stageRect = stage.getBoundingClientRect();
    const centerX = stageRect.left + natural.left + natural.width / 2 + offset.x;
    const centerY = stageRect.top + natural.top + natural.height / 2 + offset.y;

    // Vector from the cursor to the button — push further along it.
    let dx = centerX - cursorX;
    let dy = centerY - cursorY;
    let len = Math.hypot(dx, dy);
    if (len < 1) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      len = 1;
    }
    dx /= len;
    dy /= len;

    const minX = STAGE_PADDING - natural.left;
    const maxX = stageRect.width - natural.width - STAGE_PADDING - natural.left;
    const minY = STAGE_PADDING - natural.top;
    const maxY = stageRect.height - natural.height - STAGE_PADDING - natural.top;

    setOffset({
      x: clamp(offset.x + dx * PUSH_DISTANCE, minX, maxX),
      y: clamp(offset.y + dy * PUSH_DISTANCE, minY, maxY),
    });
    setAttempts((a) => Math.min(a + 1, MAX_ATTEMPTS));
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !canDodge) return;
    const btn = noBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - e.clientX, cy - e.clientY);
    const now = performance.now();
    if (dist < PROXIMITY_RADIUS && now - lastDodgeAt.current > DODGE_COOLDOWN) {
      lastDodgeAt.current = now;
      dodge(e.clientX, e.clientY);
    }
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLButtonElement>) {
    if (!canDodge) return;
    // Stops the tap from also registering as a click on the button.
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) dodge(touch.clientX, touch.clientY);
  }

  function handleNoClick() {
    if (canDodge) return;
    setCaught(true);
  }

  function handleYesClick() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(100);
    }
    onYes();
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      className="relative flex h-[70vh] max-h-[560px] w-[min(92vw,560px)] flex-col items-center justify-center gap-8 overflow-hidden rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur"
    >
      <h1 className="font-heading text-4xl leading-tight text-rose-600 sm:text-5xl">
        {t.askOut.question}
      </h1>

      <div className="relative flex w-full flex-1 items-center justify-center gap-6">
        <motion.button
          type="button"
          onClick={handleYesClick}
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="min-h-11 rounded-full bg-rose-500 px-8 py-3 font-semibold text-white shadow-lg shadow-rose-300 hover:bg-rose-600"
        >
          {t.askOut.yes}
        </motion.button>

        <motion.button
          ref={noBtnRef}
          type="button"
          onClick={handleNoClick}
          onTouchStart={handleTouchStart}
          animate={{ scale: noScale, x: offset.x, y: offset.y }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="min-h-11 rounded-full bg-gray-200 px-8 py-3 font-semibold text-gray-600 shadow"
        >
          {t.askOut.no}
        </motion.button>
      </div>

      {caught ? (
        <p className="text-sm text-rose-500">{t.askOut.notAccepted}</p>
      ) : (
        attempts > 2 && <p className="text-sm text-rose-400">{t.askOut.hint}</p>
      )}
    </div>
  );
}
