// src/components/proposal/ThreeWords.tsx
import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface ThreeWordsProps {
  onContinue: () => void;
}

/**
 * CinematicText - whole-line reveal (not word-by-word)
 */
const CinematicText = ({
  text,
  duration = 1200,
  delay = 150,
  className = "",
}: {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setMounted(true);
      setFinished(true);
      return;
    }

    const m = window.setTimeout(() => setMounted(true), 20);
    const f = window.setTimeout(() => setFinished(true), duration + delay + 80);
    return () => {
      clearTimeout(m);
      clearTimeout(f);
    };
  }, [duration, delay]);

  if (finished) return <span className={className}>{text}</span>;

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: "opacity, transform",
      }}
      aria-hidden={false}
    >
      {text}
    </span>
  );
};

export const ThreeWords = ({ onContinue }: ThreeWordsProps) => {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef(false);
  const SMOOTH = 1200; // slowed as requested

  useEffect(() => {
    if (revealRef.current) return;
    revealRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  const handleReveal = () => {
    if (!revealed) setRevealed(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 55%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      <FloatingHearts />

      <div
        className="relative z-10 w-full max-w-2xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease-in-out, transform ${SMOOTH}ms ease-in-out`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        {/* Title */}
        <h1 className="font-serif text-hero text-foreground mb-6">A Line for US💗</h1>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl shadow-xl mb-8">
          <p className="text-muted-foreground mb-6">Tap the card to reveal.</p>

          {/* Reveal Box */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleReveal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleReveal();
            }}
            className="mx-auto w-full max-w-md rounded-xl p-8 cursor-pointer select-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,250,0.92))",
              boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
            }}
          >
            {/* Intro */}
            {!revealed && (
              <div>
                <CinematicText
                  text="When I try to describe us, it always comes back to this..."
                  duration={1100}
                  delay={220}
                  className="text-base md:text-lg leading-relaxed"
                />
                <p className="text-sm text-muted-foreground mt-4">Tap to reveal.</p>
              </div>
            )}

            {/* Revealed sentence — whole-line reveal */}
            {revealed && (
              <div
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0) scale(1)" : "translateY(8px) scale(0.97)",
                  transition: "opacity 900ms ease, transform 900ms ease",
                }}
                className="font-serif"
              >
                <CinematicText
                  text="You and I are a perfect match🤍"
                  duration={1200}
                  delay={120}
                  className="text-xl md:text-2xl font-semibold drop-shadow-sm whitespace-nowrap text-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {revealed && (
          <button onClick={() => onContinue()} className="btn-romantic mt-2" aria-label="Continue">
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default ThreeWords;
