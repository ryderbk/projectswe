// src/components/proposal/FinalStage.tsx
import { useState, useEffect, useRef } from "react";
import { AnimatedHeartSVG } from "./HeartIcon";
import { FloatingHearts } from "./FloatingHearts";

interface FinalStageProps {
  photoPath: string;
}

export const FinalStage = ({ photoPath }: FinalStageProps) => {
  const [pageReady, setPageReady] = useState(false);
  const [contentMounted, setContentMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Strict-mode guard
  const mountedOnceRef = useRef(false);

  const SMOOTH_MS = 550; // animation duration
  const PAGE_DELAY = 350; // delay before reveal

  // Page entry delay
  useEffect(() => {
    const t = setTimeout(() => {
      setPageReady(true);

      if (!mountedOnceRef.current) {
        mountedOnceRef.current = true;

        setContentMounted(true);

        // reveal after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setContentVisible(true);
          });
        });
      }
    }, PAGE_DELAY);

    return () => clearTimeout(t);
  }, []);

  const handleDownload = () => {
    window.open("https://drive.google.com/file/d/1LMe0u-k8qBJTCd51HEuTG_4cLHkX1yJt/view?usp=sharing", "_blank");
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Page wrapper fade-in
  const pageStyle = {
    transition: `opacity ${SMOOTH_MS}ms ease-in-out, transform ${SMOOTH_MS}ms ease-in-out`,
    opacity: pageReady ? 1 : 0,
    transform: pageReady ? "translateY(0)" : "translateY(10px)",
  };

  // Content reveal
  const contentStyle: React.CSSProperties = {
    transition: `opacity ${SMOOTH_MS}ms cubic-bezier(.2,.9,.3,1), transform ${SMOOTH_MS}ms cubic-bezier(.2,.9,.3,1)`,
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? "translateY(0)" : "translateY(-10px)",
    pointerEvents: contentVisible ? "auto" : "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={pageStyle}
    >
      {/* Soft background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 50%, hsl(30 100% 97%) 100%)",
        }}
      />

      {/* ❤️ FLOATING HEARTS — ALWAYS ABOVE EVERYTHING */}
      <div className="pointer-events-none fixed inset-0 z-[999]">
        <FloatingHearts />
      </div>

      {/* CONTENT */}
      {contentMounted && (
        <div
          className="relative z-10 text-center max-w-lg w-full"
          style={contentStyle}
          role="main"
          aria-labelledby="final-title"
        >
          {/* Heart */}
          <div
            className="w-28 h-28 mx-auto mb-6"
            style={{
              transition: `opacity ${SMOOTH_MS}ms ease, transform ${SMOOTH_MS}ms ease`,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(14px)",
            }}
            aria-hidden
          >
            <AnimatedHeartSVG />
          </div>

          {/* Title */}
          <h1
            id="final-title"
            className="font-serif text-4xl md:text-5xl text-foreground mb-6"
            style={{
              transition: `opacity ${SMOOTH_MS}ms ease, transform ${SMOOTH_MS}ms ease`,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            Forever continues, my love.
          </h1>

          {/* Save the Date Card */}
          <div
            className="glass-card rounded-2xl p-8 mb-8"
            style={{
              transition: `opacity ${SMOOTH_MS}ms ease, transform ${SMOOTH_MS}ms ease`,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "scale(1)" : "scale(0.96)",
            }}
          >
            {/* Larger Image */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-6 border-primary/20">
              <img
                src={photoPath}
                alt="Us"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
              A Promise
            </p>

            <p className="font-serif text-2xl text-foreground mb-1">
              I’ll hold your hand until the very last moment.
            </p>

            <div
              className="mt-6 pt-6 border-t border-border"
              style={{
                transition: `opacity ${SMOOTH_MS}ms ease`,
                opacity: contentVisible ? 1 : 0,
              }}
            >
              <p className="text-muted-foreground italic font-serif">
                "Two hearts, one forever."
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              transition: `opacity ${SMOOTH_MS}ms ease, transform ${SMOOTH_MS}ms ease`,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <button
              onClick={handleDownload}
              className="btn-romantic flex items-center justify-center gap-2"
              aria-label="Save memories"
            >
              Save 🤍
            </button>
          </div>

          {/* Footer */}
          <p
            className="mt-12 text-muted-foreground text-sm"
            style={{
              transition: `opacity ${SMOOTH_MS}ms ease`,
              opacity: contentVisible ? 1 : 0,
            }}
          >
            Kojam Efforts Neraiya Kaadhal🐼
          </p>
        </div>
      )}
    </div>
  );
};

export default FinalStage;
