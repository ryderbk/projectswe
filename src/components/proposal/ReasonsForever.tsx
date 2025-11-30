// src/components/proposal/ReasonsForever.tsx
import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface ReasonsForeverProps {
  onContinue: () => void;
  revealDelay?: number;
}

export const ReasonsForever = ({ onContinue, revealDelay = 700 }: ReasonsForeverProps) => {
  const reasons = [
    "You make my heart melt when your eyes glow as you smile.",
    "You have a voice that I love, especially when you call me by my name.",
    "You show your love through action by caring without expressing it verbally.",
    "You are my comfort; your presence feels like home every single time.",
    "You are my peace and my chaos in the cutest balance.",
    "You are always the first person I want to share everything with.",
    "You inspire me to grow and become the best version of myself.",
    "You make me laugh by speaking harsh words when mad, then giving a cute \"sorry\".",
    "You have your cute stubbornness, a pure heart, that unforgettable smile and blush, and your random nose expression.",
    "You possess the most charming feature: your adorable chubbiness.",
    "You are just... YOU. That's why I see my future with you clearly, beautifully, fully.",
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const mountedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const SMOOTH = 700;
  const TRANS_DUR = 900;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    reasons.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setVisibleCount((v) => Math.max(v, i + 1));
      }, i * revealDelay + 300);
      timersRef.current.push(t);
    });

    const finishT = window.setTimeout(() => {
      setCelebrated(true);
      spawnConfetti();
    }, reasons.length * revealDelay + 600);

    timersRef.current.push(finishT);

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  }, [revealDelay]);

  const spawnConfetti = () => {
    const root = document.body;
    if (!root) return;
    const count = 12;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.textContent = i % 2 ? "💗" : "✨";
      el.style.position = "fixed";
      el.style.left = `${Math.random() * 80 + 10}%`;
      el.style.top = `-10%`;
      el.style.fontSize = `${Math.floor(Math.random() * 18 + 16)}px`;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.transform = `translateY(0) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.transition =
        `transform ${900 + Math.random() * 900}ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease`;

      root.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `translateY(${window.innerHeight * (0.55 + Math.random() * 0.25)}px) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 400);
      }, 1400 + Math.random() * 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      {/* FLOATING HEARTS — ABOVE ALL ELEMENTS */}
      <div className="pointer-events-none fixed inset-0 z-[999]">
        <FloatingHearts />
      </div>

      {/* Main content (z-10 so hearts remain above) */}
      <div
        className="relative z-10 max-w-3xl w-full text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: 1,
          transform: "translateY(0)",
        }}
      >
        <div className="glass-card p-6 rounded-2xl shadow-xl animate-scale-in">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            11 Reasons Why I Want You Forever🤍
          </h1>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {reasons.map((text, i) => {
              const shown = i < visibleCount;
              return (
                <div
                  key={i}
                  className={`rounded-xl border bg-pink-50/50 shadow-sm transition-all ease-[cubic-bezier(.2,.9,.2,1)]
                    ${shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97] pointer-events-none"}`}
                  style={{
                    padding: "14px",
                    transitionDuration: `${TRANS_DUR}ms`,
                  }}
                >
                  <p className="m-0 text-center font-medium text-gray-900 leading-relaxed">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>

          {visibleCount >= reasons.length && (
            <div className="mt-8 animate-fade-in-up">
              <button onClick={onContinue} className="btn-romantic px-10 py-4 text-lg">
                Next ❤️
              </button>

              {celebrated && (
                <p className="text-sm text-warm-gray mt-4 italic">Confetti because you're my everything 🎉</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReasonsForever;
