import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { FloatingSparkles } from "./FloatingSparkles";
import { EnvelopeOpening } from "./EnvelopeOpening";
import { captureAndDownload } from "./screenshotUtils";

interface HandwrittenLetterProps {
  onContinue?: () => void;
}

export default function HandwrittenLetter({ onContinue }: HandwrittenLetterProps) {
  const [mounted, setMounted] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const mountedRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

  if (!showLetter) {
    return (
      <>
        <FloatingHearts />
        <FloatingSparkles />
        <EnvelopeOpening
          onOpen={() => {
            setShowLetter(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex items-start justify-center pt-8 pb-8 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
      />

      <FloatingHearts />
      <FloatingSparkles />

      <div
        id="letter-container"
        className="relative z-10 w-[96vw]"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        <h1 className="font-serif text-4xl md:text-5xl text-foreground text-center mb-6">
          A Letter For You 🤍
        </h1>

        {/* GLASS CARD */}
        <div
          className="handwritten-card mx-auto"
          style={{
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",

            // 🌟 TRUE GLASS MORPHISM STYLE
            background: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",

            borderRadius: "28px",
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.08), inset 0 0 40px rgba(255,255,255,0.25)",
          }}
        >
          {/* SCROLL CONTENT AREA */}
          <div
            className="handwritten-scroll"
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: "2.5rem",

              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .handwritten-scroll::-webkit-scrollbar { display: none; }
              `}
            </style>

            {/* FLEX COLUMN so button stays at bottom when content is short */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                justifyContent: "space-between",
              }}
            >
              {/* LETTER CONTENT */}
              <article
                className="prose mx-auto"
                style={{
                  fontFamily:
                    "'Indie Flower', 'Segoe UI Historic', 'Segoe UI', sans-serif",
                  fontSize: "1.28rem",
                  lineHeight: "1.9rem",
                  color: "#333",
                  maxWidth: "none",
                }}
              >
                <p className="mb-4 text-2xl font-semibold">
                  YET TO WRITE
                </p>
              </article>

              {/* BUTTON AT THE END */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={async () => {
                    await captureAndDownload("letter-container", "my-letter.png");
                    setMounted(false);
                    setTimeout(() => onContinue && onContinue(), 180);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl shadow text-lg bg-white/40 hover:bg-white/60 transition-all"
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                  }}
                >
                  Continue ❤️
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
