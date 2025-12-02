import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

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
    }, 850);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background - Match the gradient from other pages */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      <FloatingHearts />

      {/* Main Container */}
      <div
        className="relative z-10"
        style={{
          perspective: "1000px",
        }}
      >
        {/* Envelope */}
        <div
          onClick={handleOpen}
          className="cursor-pointer transition-all"
          style={{
            width: "320px",
            height: "200px",
            transform: mounted && !opened ? "scale(1)" : opened ? "scale(1.02)" : "scale(0.9)",
            opacity: mounted ? 1 : 0,
            transition: opened ? "none" : `transform ${SMOOTH}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${SMOOTH}ms ease`,
          }}
        >
          {/* Envelope Body - using glass-card style */}
          <div
            className="glass-card h-full flex flex-col rounded-2xl relative overflow-hidden border-2"
            style={{
              borderColor: "hsl(350 100% 85%)",
              boxShadow: "0 20px 40px hsl(0 100% 74% / 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.6)",
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
                transition: opened ? `transform 550ms cubic-bezier(0.36, 0, 0.66, -0.56)` : "none",
                transform: opened ? "rotateX(-130deg)" : "rotateX(0deg)",
                borderBottom: "2px solid hsl(350 85% 80%)",
              }}
            />

            {/* Letter Inside - Slides up on open */}
            {opened && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: "20px 15px",
                  opacity: 1,
                  animation: "slideUpLetter 550ms cubic-bezier(0.34, 1.56, 0.64, 1) 250ms both",
                }}
              >
                <div
                  className="rounded-lg shadow-lg"
                  style={{
                    width: "100%",
                    height: "130px",
                    background: "linear-gradient(135deg, hsl(0 0% 99%) 0%, hsl(30 100% 97%) 100%)",
                    border: "1px solid hsl(0 0% 90%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(0 0% 40%)",
                    fontSize: "13px",
                    fontFamily: "'Playfair Display', serif",
                    textAlign: "center",
                    padding: "12px",
                  }}
                >
                  💌 Opening...
                </div>
              </div>
            )}

            {/* Envelope Front - shows when closed */}
            {!opened && (
              <div
                className="flex-1 flex flex-col items-center justify-center"
                style={{
                  animation: mounted ? "fadeInEnvelope 550ms ease-out" : "none",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>💌</div>
                <div
                  className="font-serif font-medium"
                  style={{
                    fontSize: "14px",
                    letterSpacing: "1px",
                    color: "hsl(350 70% 60%)",
                  }}
                >
                  Click to Open
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sparkle Bursts on Open */}
        {opened && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  pointerEvents: "none",
                  "--angle": `${(i / 6) * 360}deg`,
                  "--distance": "100px",
                } as React.CSSProperties & { "--angle": string; "--distance": string }}
              >
                <style>
                  {`
                    @keyframes sparkle-burst-${i} {
                      0% {
                        transform: translate(-50%, -50%) translate(0, 0) scale(1);
                        opacity: 0.6;
                      }
                      100% {
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(0);
                        opacity: 0;
                      }
                    }
                  `}
                </style>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "hsl(0 100% 85%)",
                    boxShadow: "0 0 8px hsl(350 100% 75%)",
                    animation: `sparkle-burst-${i} 800ms ease-out forwards`,
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideUpLetter {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInEnvelope {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
