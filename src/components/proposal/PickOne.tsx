// src/components/proposal/PickOne.tsx
import { useEffect, useRef, useState } from "react";

interface PickOneProps {
  onContinue: () => void;
}

export const PickOne = ({ onContinue }: PickOneProps) => {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [exiting, setExiting] = useState(false);
  const revealRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const SMOOTH = 550;
  const SELECT_DELAY = 900; // ⬅️ REDUCED DELAY

  useEffect(() => {
    if (revealRef.current) return;
    revealRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const options = [
    {
      id: 0,
      title: "Coffee Date☕",
      desc: "Warm coffee, soft talks, and my favourite person.",
    },
    {
      id: 1,
      title: "Kaalan Date🍛",
      desc: "Spicy kaalan and your cute reactions while eating it.",
    },
    {
      id: 2,
      title: "Ilaineer Date🥥",
      desc: "Fresh coconut water, calm breeze, and peaceful time together.",
    },
  ];

  const handleSelect = (id: number) => {
    if (choice === id) return;
    setChoice(id);

    timerRef.current = window.setTimeout(() => {
      setExiting(true);
    }, SELECT_DELAY);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (exiting && e.propertyName === "opacity") {
      onContinue();
    }
  };

  return (
    <div id="pickone-container" className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-2xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: exiting ? 0 : mounted ? 1 : 0,
          transform: exiting ? "translateY(-20px)" : mounted ? "translateY(0)" : "translateY(14px)",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <h1 className="font-serif text-hero text-foreground mb-6">
          Pick One For Us — when we met 🤍
        </h1>

        <div className="glass-card p-6 rounded-2xl shadow-xl mb-8">
          <p className="text-muted-foreground mb-6">
            Choose what you'd like us to do next — I'll make it happen ✨
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {options.map((o) => {
              const isSelected = choice === o.id;

              return (
                <button
                  key={o.id}
                  onClick={() => handleSelect(o.id)}
                  className={`p-4 rounded-xl text-left transition-transform transform ${
                    isSelected
                      ? "scale-105 bg-primary"
                      : "bg-white/80 text-foreground hover:scale-105"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? "0 8px 30px rgba(239,71,111,0.14)"
                      : "0 6px 18px rgba(16,24,40,0.04)",
                    minHeight: 120,
                  }}
                >
                  {/* Title */}
                  <div
                    className={`font-semibold font-serif text-lg mb-2 ${
                      isSelected ? "text-white" : "text-foreground"
                    }`}
                  >
                    {o.title}
                  </div>

                  {/* Description */}
                  <div
                    className={`text-sm ${
                      isSelected ? "text-white/90" : "text-muted-foreground"
                    }`}
                  >
                    {o.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              {choice === null
                ? "Tap an option to pick it."
                : "Nice choice ma — doing it soon ❤️"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickOne;
