import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { FloatingSparkles } from "./FloatingSparkles";
import envelopeImage from "@/assets/envelope.jpg";

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
              className="cursor-pointer"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Envelope Image */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  margin: "0 auto",
                  position: "relative",
                  transform: mounted && !opened ? "scale(1)" : "scale(0.9)",
                  opacity: mounted ? 1 : 0,
                  transition: `transform ${SMOOTH}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${SMOOTH}ms ease`,
                }}
              >
                <img
                  src={envelopeImage}
                  alt="Envelope"
                  style={{
                    width: "100%",
                    height: "auto",
                    filter: "drop-shadow(0 12px 28px hsl(350 100% 74% / 0.2))",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>

              {/* Hover hint */}
              <div
                style={{
                  marginTop: "40px",
                  fontSize: "14px",
                  color: "hsl(0 0% 50%)",
                  fontWeight: 500,
                  opacity: 0.6,
                  animation: "pulse-hint 2s ease-in-out infinite",
                }}
              >
                Click to open
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
                      animation: `bounce 1.4s ease-in-out infinite`,
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
