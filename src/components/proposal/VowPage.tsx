import React, { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface VowPageProps {
  onContinue: () => void;
  vows?: string[];
  revealDelay?: number;
}

/**
 * VowPage — smooth slow romantic flow
 * - prevents flicker by waiting for a paint mount before starting timers
 * - slower reveal and smoother transitions
 * - Replay button removed
 */
export const VowPage: React.FC<VowPageProps> = ({
  onContinue,
  vows = [
    "I promise to love you in your quiet and your loud.",
    "I promise to hold your hand through easy days and hard ones.",
    "I promise to celebrate your wins and learn from our mistakes.",
    "I promise to make space for your dreams and keep mine tied to yours.",
    "I promise to laugh with you, cry with you, and grow with you.",
  ],
  revealDelay = 900, // slow reveal
}) => {
  const [mounted, setMounted] = useState(false); // for initial paint guard
  const [phase, setPhase] = useState<"intro" | "reveal" | "outro">("intro");
  const [visibleCount, setVisibleCount] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  const startedRef = useRef(false); // ensures timers set only once
  const timersRef = useRef<number[]>([]);
  const SMOOTH = 800; // slower smooth transitions

  // mount guard to stop flicker: wait two RAFs before starting sequence
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setMounted(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // start the intro/reveal flow only after mounted becomes true
  useEffect(() => {
    if (!mounted) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // gentle intro delay, then reveal
    const introT = window.setTimeout(() => {
      setPhase("reveal");

      vows.forEach((_, i) => {
        const t = window.setTimeout(() => {
          setVisibleCount((prev) => Math.max(prev, i + 1));
        }, revealDelay * i + 180); // per-item reveal timing
        timersRef.current.push(t);
      });

      // finish: show outro after last reveal (slightly delayed)
      const finishT = window.setTimeout(() => {
        setPhase("outro");
        setCelebrated(true);
        spawnConfetti();
      }, revealDelay * vows.length + 700);
      timersRef.current.push(finishT);
    }, 2500); // longer intro pause to let user read the intro text
    timersRef.current.push(introT);

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ephemeral DOM confetti/hearts
  const spawnConfetti = () => {
    const root = document.body;
    if (!root) return;
    const count = 12;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.textContent = i % 2 === 0 ? "💗" : "✨";
      el.style.position = "fixed";
      el.style.left = `${Math.random() * 80 + 10}%`;
      el.style.top = `-10%`;
      el.style.fontSize = `${Math.floor(Math.random() * 20 + 14)}px`;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.transform = `translateY(0) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.transition = `transform ${1200 + Math.random() * 1000}ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease`;
      root.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `translateY(${window.innerHeight * (0.55 + Math.random() * 0.25)}px) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => {
          if (el.parentElement) el.parentElement.removeChild(el);
        }, 400);
      }, 1700 + Math.random() * 800);
    }
  };

  // small accessibility / cleanup helper if user wants to replay sequence elsewhere
  const resetSequence = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    startedRef.current = false;
    setVisibleCount(0);
    setPhase("intro");
    setCelebrated(false);
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      aria-live="polite"
    >
      {/* soft background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      <FloatingHearts />

      <div
        className="max-w-3xl w-full bg-white rounded-2xl shadow-soft p-8 sm:p-10 text-center relative"
        style={{
          // fade in container only after mount to avoid flicker
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
        }}
      >
        {/* intro headline (kept subtle until mounted) */}
        <div
          style={{
            transition: `opacity ${SMOOTH}ms ease`,
            opacity: phase === "intro" ? 1 : 0,
            pointerEvents: phase === "intro" ? "auto" : "none",
            minHeight: 40,
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-serif"
            style={{ fontFamily: `'Playfair Display', serif` }}
          >
            I have a few promises for you…
          </h2>
        </div>

        {/* vow cards */}
        <div className="mt-4 sm:mt-6 space-y-5">
          {vows.map((v, i) => {
            const shown = i < visibleCount;
            return (
              <div
                key={i}
                className={`transform transition-all duration-[900ms] ease-[cubic-bezier(.2,.9,.2,1)]
                  ${shown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
              >
                <div className="p-5 rounded-2xl border bg-pink-50/40 shadow-sm text-center font-medium">
                  <p className="text-lg md:text-xl font-medium text-gray-800 italic m-0">
                    {v}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* outro / CTA */}
        {phase === "outro" && (
          <div
            className="animate-fade-in-up"
            style={{
              marginTop: 40,
              transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
            }}
          >
            <p className="text-base text-warm-gray italic mb-6">
              These are my promises — simple, imperfect, completely for you.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                className="btn-romantic px-10 py-4 text-lg"
                onClick={onContinue}
              >
                Say yes ♥
              </button>
            </div>

            {celebrated && (
              <p className="text-sm text-warm-gray mt-4 italic">
                Confetti because you're my everything 🎉
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default VowPage;
