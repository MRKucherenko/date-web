"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface Heart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  opacity: number;
}

const HEART_COUNT = 26;
const EMOJI = "💖";

function spawnHeart(width: number, height: number): Heart {
  return {
    x: Math.random() * width,
    y: height + Math.random() * height * 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(0.5 + Math.random() * 1),
    size: 14 + Math.random() * 16,
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.02,
    opacity: 0.5 + Math.random() * 0.5,
  };
}

export default function ConfettiHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    const hearts = Array.from({ length: HEART_COUNT }, () => spawnHeart(width, height));

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      for (const heart of hearts) {
        heart.x += heart.vx;
        heart.y += heart.vy;
        heart.rotation += heart.vr;
        if (heart.y < -40) {
          Object.assign(heart, spawnHeart(width, height * 0.2));
          heart.y = height + 40;
        }
        ctx!.save();
        ctx!.translate(heart.x, heart.y);
        ctx!.rotate(heart.rotation);
        ctx!.globalAlpha = heart.opacity;
        ctx!.font = `${heart.size}px sans-serif`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(EMOJI, 0, 0);
        ctx!.restore();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  if (reducedMotion || typeof document === "undefined") return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />,
    document.body
  );
}
