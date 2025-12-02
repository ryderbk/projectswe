import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { FloatingSparkles } from "./FloatingSparkles";

interface EnvelopeOpeningProps {
  onOpen?: () => void;
}

export const EnvelopeOpening = ({ onOpen }: EnvelopeOpeningProps) => {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const mountedRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      onOpen?.();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      <FloatingHearts />
      <FloatingSparkles />

      {/* Content Container */}
      <div
        className="relative z-10 w-full max-w-xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 flex items-center justify-center gap-3">
          <span>A Letter for You</span>
          <span className="inline-flex items-center text-5xl">🤍</span>
        </h1>

        {/* Glass Card with Envelope */}
        <div className="glass-card p-8 rounded-2xl shadow-xl">
          {!opened ? (
            // Closed Envelope
            <div
              onClick={handleOpen}
              className="cursor-pointer transition-all"
              style={{
                perspective: "1000px",
              }}
            >
              {/* Envelope */}
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  maxWidth: "300px",
                  margin: "0 auto",
                  position: "relative",
                  transform: mounted && !opened ? "scale(1)" : "scale(0.9)",
                  opacity: mounted ? 1 : 0,
                  transition: `transform ${SMOOTH}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${SMOOTH}ms ease`,
                }}
              >
                {/* Envelope Body */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, hsl(350 100% 92%) 0%, hsl(20 100% 94%) 100%)",
                    borderRadius: "12px",
                    border: "2px solid hsl(350 90% 85%)",
                    boxShadow: "inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 12px 28px hsl(0 100% 74% / 0.12)",
                    overflow: "hidden",
                  }}
                >
                  {/* Envelope Flap - Opens upward */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(180deg, hsl(350 95% 88%) 0%, hsl(350 100% 92%) 100%)",
                      transformOrigin: "top center",
                      transition: "none",
                      transform: "rotateX(0deg)",
                      borderBottom: "2px solid hsl(350 85% 80%)",
                    }}
                  />

                  {/* Envelope Front Content */}
                  <div
                    className="flex-1 flex flex-col items-center justify-center h-full"
                    style={{
                      animation: mounted ? "fadeInContent 550ms ease-out" : "none",
                    }}
                  >
                    <div style={{ fontSize: "56px", marginBottom: "16px" }}>💌</div>
                    <div
                      className="font-serif font-medium"
                      style={{
                        fontSize: "16px",
                        letterSpacing: "1.2px",
                        color: "hsl(350 70% 55%)",
                        textTransform: "uppercase",
                      }}
                    >
                      Click to Open
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "hsl(350 50% 65%)",
                        marginTop: "12px",
                        fontStyle: "italic",
                      }}
                    >
                      A message from my heart
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover hint */}
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "13px",
                  color: "hsl(0 0% 50%)",
                  opacity: 0.6,
                  animation: "pulse-hint 2s ease-in-out infinite",
                }}
              >
                ↑ Click to reveal
              </div>
            </div>
          ) : (
            // Opened State
            <div
              style={{
                animation: "slideUpContent 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💌</div>
              <p className="text-lg text-foreground font-serif mb-6">
                Opening your letter...
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                A handwritten note, written from the depths of my heart.
              </p>

              {/* Decorative elements while loading */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "hsl(0 100% 74%)",
                      animation: `bounce ${1.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-sm text-muted-foreground mt-6">
          Take your time. This is for you. 💝
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInContent {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUpContent {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-hint {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-4px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
