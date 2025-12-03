import { useState, useEffect, useRef } from "react";

interface QuizPageProps {
  onContinue: () => void;
}

export const QuizPage = ({ onContinue }: QuizPageProps) => {
  const [mounted, setMounted] = useState(false);

  // quiz state
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const [revealHidden, setRevealHidden] = useState(false);
  const [clickedWrongSet, setClickedWrongSet] = useState<Set<string>>(new Set());

  // transition states
  const [startExitAnim, setStartExitAnim] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const visibleRef = useRef(false);
  const SMOOTH = 650;

  useEffect(() => {
    if (visibleRef.current) return;
    visibleRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

  // WRONG answers
  const wrongOptions = [
    "Your eyes 👀",
    "Your voice 🎶",
    "Your smile 😊",
    "Your cheeks 💗",
    "Your shape ✨",
  ];

  // CORRECT answer (hidden at first)
  const correctOption = "Everything about you — every little thing I adore you for 🤍";

  // visible options
  const visibleOptions = revealHidden ? [...wrongOptions, correctOption] : [...wrongOptions];

  const handleSelect = (ans: string) => {
    if (correct) return;

    setSelected(ans);

    if (ans === correctOption) {
      setCorrect(true);

      // start exit animation (fade/scale main card)
      // then reveal the fullscreen overlay smoothly
      setTimeout(() => setStartExitAnim(true), 160); // small pause before anim starts
      setTimeout(() => setShowFullscreen(true), 760); // overlay appears after main anim begins
      return;
    }

    // track wrong answers; reveal hidden option after exhausting wrong ones
    setClickedWrongSet((prev) => {
      const next = new Set(prev);
      next.add(ans);
      if (next.size >= wrongOptions.length) {
        setRevealHidden(true);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background (kept constant) */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
      />

      {/* MAIN QUIZ CARD */}
      <div
        className="relative z-10 w-full max-w-xl text-center transition-all"
        style={{
          transition: `opacity 600ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1)`,
          opacity: mounted ? (startExitAnim ? 0 : 1) : 0,
          transform: mounted
            ? startExitAnim
              ? "translateY(-18px) scale(1.03)"
              : "translateY(0) scale(1)"
            : "translateY(12px)",
          pointerEvents: showFullscreen ? "none" : "auto",
        }}
      >
        <h1 className="font-serif text-hero text-foreground mb-8">
          What do you think I love the MOST about you? 💗
        </h1>

        <div className="glass-card p-8 rounded-2xl shadow-xl space-y-6">

          <div className="space-y-3">
            {visibleOptions.map((ans) => {
              const isSelected = selected === ans;
              return (
                <button
                  key={ans}
                  onClick={() => handleSelect(ans)}
                  disabled={correct}
                  style={{
                    transition: `all ${SMOOTH}ms cubic-bezier(.2,.9,.2,1)`,
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                  }}
                  className={`w-full py-3 rounded-xl border ${
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-white/70 border-primary/20 text-foreground"
                  }`}
                >
                  {ans}
                </button>
              );
            })}
          </div>

          {selected && !correct && (
            <p
              className="text-sm text-muted-foreground mt-4"
              style={{ transition: "opacity 400ms", opacity: 1 }}
            >
              Not that one ma 😄💗 try again…
            </p>
          )}
        </div>
      </div>

      {/* FULLSCREEN RESULT OVERLAY (kept in DOM, transitions in) */}
      <div
        aria-hidden={!showFullscreen}
        style={{
          pointerEvents: showFullscreen ? "auto" : "none",
          position: "fixed",
          inset: 0,
          zIndex: showFullscreen ? 60 : 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          transition: "opacity 560ms cubic-bezier(.2,.9,.2,1), transform 560ms cubic-bezier(.2,.9,.2,1)",
          opacity: showFullscreen ? 1 : 0,
          transform: showFullscreen ? "translateY(0) scale(1)" : "translateY(8px) scale(.997)",
        }}
      >
        {/* overlay content (centered card) */}
        <div
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          style={{
            background: "white",
            borderRadius: 16,
            padding: "40px 36px",
            boxShadow: "0 20px 50px rgba(16,24,40,0.08)",
            minWidth: 280,
          }}
        >
          <h2
            className="font-serif text-3xl md:text-4xl text-primary mb-4"
            style={{
              transition: "transform 500ms cubic-bezier(.2,.9,.2,1), opacity 500ms",
              opacity: showFullscreen ? 1 : 0,
              transform: showFullscreen ? "translateY(0)" : "translateY(8px)",
              lineHeight: 1.05,
            }}
          >
            {correctOption}
          </h2>

          <p
            className="text-muted-foreground text-base italic mb-6"
            style={{
              opacity: showFullscreen ? 1 : 0,
              transition: "opacity 520ms 120ms ease",
            }}
          >
            That's the truth ma… every part of you is my favorite. 🤍
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={onContinue}
              className="btn-romantic px-10 py-4 text-lg"
              aria-label="Continue"
            >
              Next ❤️
            </button>
          </div>
        </div>
      </div>

      {/* small style tweaks for smoothness (keeps everything soft) */}
      <style>{`
        /* optional: slightly delay pointer-events for overlay to avoid jump */
        [aria-hidden="false"] { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};

export default QuizPage;
