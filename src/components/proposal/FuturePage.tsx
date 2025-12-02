import React, { useEffect, useRef, useState } from "react";

interface FutureItem {
  emoji: string;
  title: string;
  desc?: string;
}

interface FuturePageProps {
  onContinue: () => void;
  items?: FutureItem[];
  revealDelay?: number;
}

/**
 * FuturePage.tsx
 * - Updated to match your "ReasonsForever" style
 * - Rounded cards, smooth reveal, confetti, your theme buttons
 * - FULL FILE
 */
export const FuturePage: React.FC<FuturePageProps> = ({
  onContinue,
  items = [
    { emoji: "🏡", title: "Our Home", desc: "Cozy mornings and shared coffee" },
    { emoji: "🍳", title: "Breakfasts Together", desc: "Lazy Sundays, always" },
    { emoji: "🚗", title: "Roadtrips", desc: "Maps, music, and mid-night stops" },
    { emoji: "🍼", title: "Little Giggles", desc: "One day maybe tiny feet" },
    { emoji: "🌅", title: "Sunrises Together", desc: "Growing old hand-in-hand" },
  ],
  revealDelay = 650,
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const mountedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const SMOOTH = 550;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // reveal one-by-one
    items.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setVisibleCount((v) => Math.max(v, i + 1));
      }, i * revealDelay + 300);

      timersRef.current.push(t);
    });

    // confetti
    const confettiT = window.setTimeout(() => {
      setCelebrated(true);
      spawnConfetti();
    }, items.length * revealDelay + 600);

    timersRef.current.push(confettiT);

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DOM-based floating hearts/✨ confetti
  const spawnConfetti = () => {
    const root = document.body;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.textContent = i % 2 === 0 ? "💖" : "✨";
      el.style.position = "fixed";
      el.style.left = `${Math.random() * 80 + 10}%`;
      el.style.top = `-10%`;
      el.style.fontSize = `${Math.floor(Math.random() * 20 + 16)}px`;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.transform = `translateY(0) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.transition =
        `transform ${1200 + Math.random() * 800}ms cubic-bezier(.2,.9,.2,1), ` +
        `opacity 1000ms ease`;
      root.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform =
          `translateY(${window.innerHeight * (0.6 + Math.random() * 0.25)}px)` +
          ` rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 400);
      }, 1600 + Math.random() * 800);
    }
  };

  // replay animation
  const handleReplay = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setVisibleCount(0);
    setCelebrated(false);

    items.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setVisibleCount((v) => Math.max(v, idx + 1));
      }, idx * revealDelay + 300);
      timersRef.current.push(t);
    });

    const confettiT = window.setTimeout(() => {
      setCelebrated(true);
      spawnConfetti();
    }, items.length * revealDelay + 600);

    timersRef.current.push(confettiT);
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div
        className="max-w-4xl w-full bg-white rounded-2xl shadow-soft p-10 text-center"
        style={{ overflow: "hidden" }}
      >
        <h2
          className="text-3xl md:text-4xl font-serif mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our future, one little thing at a time
        </h2>

        <p className="text-sm text-warm-gray mb-6">
          Small icons — big promises
        </p>

        {/* GRID OF ICON CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {items.map((it, i) => {
            const shown = i < visibleCount;

            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border bg-pink-50/40 shadow-sm 
                transition-all duration-700 ease-[cubic-bezier(.2,.9,.2,1)]
                ${
                  shown
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-3 scale-[0.98] pointer-events-none"
                }`}
              >
                <div className="text-4xl md:text-5xl mb-3">{it.emoji}</div>
                <div className="font-medium text-lg text-gray-700">
                  {it.title}
                </div>
                {it.desc && (
                  <div className="text-sm text-warm-gray mt-1">{it.desc}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* FINAL SECTION */}
        {visibleCount >= items.length && (
          <div className="mt-10 animate-fade-in-up">
            <p className="text-lg md:text-xl font-medium mb-4">
              This is what I want with you — every day.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button className="btn-romantic px-8 py-3 text-lg" onClick={onContinue}>
                Join me forever? ♥
              </button>

              <button
                className="btn-secondary-romantic px-6 py-2 text-base"
                onClick={handleReplay}
              >
                Replay
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

export default FuturePage;
