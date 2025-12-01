// src/components/proposal/SpinWheel.tsx
import React, { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface SpinWheelProps {
  onContinue: () => void;
}

const DEFAULT_OPTIONS = [
  "Sing a song for me 🎤",
  "Send a cute selfie video 🎥",
  "Send a voice message saying “I love you, chellam.” 💗",
  "Call me when you have a chance 📞",
  "Text me something you've thought but never told me 💬",
  "Send a short dance video 💃",
];

export const SpinWheel: React.FC<SpinWheelProps> = ({ onContinue }) => {
  const options = DEFAULT_OPTIONS;

  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  const [index, setIndex] = useState<number>(() =>
    Math.floor(Math.random() * options.length)
  );
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  // timings
  // timings
const tickMs = 80;
const spinTotalMs = 3200;   // keep same spin duration
const settlePauseMs = 1400; // ⬅️ longer outro pause


  // Layout constants to prevent reflow/jitter
  const REEL_MAX_WIDTH = 760; // px, will constrain on large screens
  const REEL_PADDING_H = 32; // horizontal padding inside the pill (increased)
  const REEL_PADDING_V = 12; // vertical padding inside the pill (increased)
  const REEL_MIN_HEIGHT = 64; // keeps height stable while spinning (slightly larger)

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });

    // cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.0015;
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0015, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      o.frequency.setValueAtTime(880, now);
      o.frequency.exponentialRampToValueAtTime(660, now + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      o.start(now);
      o.stop(now + 0.95);
    } catch {}
  };

  const spawnConfetti = () => {
    const root = document.body;
    if (!root) return;
    const count = 12;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.textContent = i % 2 ? "✨" : "💖";
      el.style.position = "fixed";
      el.style.left = `${40 + Math.random() * 20}%`;
      el.style.top = `40%`;
      el.style.fontSize = `${12 + Math.floor(Math.random() * 22)}px`;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.transform = `translateY(0) rotate(${Math.random() * 50 - 25}deg)`;
      el.style.transition =
        "transform 900ms cubic-bezier(.2,.9,.2,1), opacity 700ms ease";
      root.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `translateY(${140 +
          Math.random() * 180}px) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => {
          el.remove();
        }, 500);
      }, 900 + Math.random() * 500);
    }
  };

  const spin = () => {
    if (spinning) return;

    setResult(null);
    setFinished(false);
    setSpinning(true);

    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % options.length);
    }, tickMs);

    stopTimeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const finalIndex = Math.floor(Math.random() * options.length);
      let step = 0;
      const slowSteps = 8;

      const slowSpin = () => {
        step++;
        setIndex((finalIndex + step) % options.length);
        if (step < slowSteps) {
          stopTimeoutRef.current = window.setTimeout(
            slowSpin,
            70 + step * 90
          );
        } else {
          const chosen = options[finalIndex];
          setResult(chosen);
          playChime();
          spawnConfetti();
          setSpinning(false);

          stopTimeoutRef.current = window.setTimeout(() => {
            setFinished(true);
          }, settlePauseMs);
        }
      };

      stopTimeoutRef.current = window.setTimeout(slowSpin, 120);
    }, spinTotalMs);
  };

  const retry = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);

    setSpinning(false);
    setResult(null);
    setFinished(false);
    setIndex(Math.floor(Math.random() * options.length));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* BG */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
      />

      <FloatingHearts />

      <div
        className="relative z-10 text-center max-w-xl w-full"
        style={{
          transition: "opacity 550ms ease, transform 550ms ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {/* Heading (inline heart) */}
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 whitespace-nowrap flex items-center justify-center gap-2">
          <span>See what you dare to do</span>
          <span className="inline-flex items-center translate-y-[1px]">😉</span>
        </h1>

        <div className="glass-card p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6">
          {/* REEL — stabilized dimensions so text changes don't shift layout */}
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-md flex justify-center"
            style={{
              // keep the overall block stable in height so the page doesn't jump
              minHeight: REEL_MIN_HEIGHT + REEL_PADDING_V * 2,
            }}
          >
            <div
              // the pill: fixed max-width, centered; text wraps inside with nice spacing
              style={{
                width: "100%",
                maxWidth: REEL_MAX_WIDTH,
                minHeight: REEL_MIN_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: `${REEL_PADDING_V}px ${REEL_PADDING_H}px`,
                borderRadius: 9999,
                background: "rgba(255,228,236,0.9)", // similar to bg-pink-50/70
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "rgba(0,0,0,0.04) 0px 4px 16px",
                textAlign: "center",
                fontSize: 18,
                lineHeight: 1.45, // improved line spacing for wrapped text
                boxSizing: "border-box",
                // ensure the pill itself doesn't animate its width while spinning
                transition: "none",
                whiteSpace: "normal", // allow wrapping inside the pill
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
            >
              <span style={{ display: "inline-block", width: "100%" }}>
                {result ?? options[index]}
              </span>
            </div>
          </div>

          <div aria-hidden style={{ height: 4 }} />

          {/* BUTTONS */}
          <div className="flex items-center gap-4">
            {!result && (
              <button
                onClick={spin}
                disabled={spinning}
                className="btn-romantic px-8 py-3"
              >
                {spinning ? "Spinning…" : "Spin ❤️"}
              </button>
            )}

            {result && (
              <>
                <button onClick={onContinue} className="btn-romantic px-8 py-3">
                  Done ✓
                </button>

                <button
                  onClick={retry}
                  className="btn-secondary-romantic px-6 py-3"
                >
                  Retry
                </button>
              </>
            )}
          </div>

          {result && (
            <p className="text-sm text-warm-gray mt-2 italic">
              Take your time… then press Done ❤️
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
