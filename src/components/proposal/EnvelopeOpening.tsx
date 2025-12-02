import { useEffect, useRef, useState } from "react";

interface EnvelopeOpeningProps {
  onOpen?: () => void;
}

export const EnvelopeOpening = ({ onOpen }: EnvelopeOpeningProps) => {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    // Paint delay: wait for browser to render, then reveal
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      onOpen?.();
    }, 850); // Wait for all animations to complete
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
      />

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
          className="cursor-pointer"
          style={{
            width: "280px",
            height: "180px",
            transition: opened
              ? "none"
              : "transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 550ms ease",
            transform: mounted && !opened ? "scale(1)" : opened ? "scale(1.05)" : "scale(0.9)",
            opacity: mounted ? 1 : 0,
            filter: "drop-shadow(0 20px 40px rgba(244, 114, 182, 0.15))",
          }}
        >
          {/* Envelope Body - Soft Pastel Pink */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, hsl(350 100% 92%) 0%, hsl(20 100% 94%) 100%)",
              borderRadius: "8px",
              border: "2px solid hsl(350 90% 85%)",
              boxShadow: "inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 10px 25px rgba(244, 114, 182, 0.1)",
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
                transition: opened ? "transform 550ms cubic-bezier(0.36, 0, 0.66, -0.56)" : "none",
                transform: opened ? "rotateX(-130deg)" : "rotateX(0deg)",
                borderBottom: "2px solid hsl(350 85% 80%)",
              }}
            />

            {/* Letter Inside - Slides up */}
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
                opacity: opened ? 1 : 0,
                transition: opened ? "opacity 400ms ease-in 250ms, transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1) 250ms" : "none",
                transform: opened ? "translateY(0)" : "translateY(40px)",
              }}
            >
              {/* Letter Paper */}
              <div
                style={{
                  width: "100%",
                  height: "130px",
                  background: "linear-gradient(135deg, hsl(0 0% 99%) 0%, hsl(30 100% 97%) 100%)",
                  borderRadius: "4px",
                  border: "1px solid hsl(0 0% 90%)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(0 0% 40%)",
                  fontSize: "13px",
                  fontFamily: "'Indie Flower', serif",
                  textAlign: "center",
                  padding: "12px",
                }}
              >
                💌 Opening...
              </div>
            </div>

            {/* Envelope Front Text */}
            {!opened && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(350 70% 60%)",
                  textAlign: "center",
                  opacity: 0.7,
                  transition: "opacity 300ms ease",
                  opacity: mounted ? 0.7 : 0.3,
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>💌</div>
                <div
                  style={{
                    fontSize: "13px",
                    fontFamily: "'Indie Flower', serif",
                    fontWeight: 500,
                    letterSpacing: "1px",
                  }}
                >
                  Click to Open
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Sparkle Bursts on Open */}
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
                  animation: `sparkle-burst-${i} 800ms ease-out forwards`,
                  "--angle": `${(i / 6) * 360}deg`,
                  "--distance": "80px",
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
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Style for Glow Effect */}
      <style>{`
        @keyframes gentle-glow {
          0%, 100% {
            filter: drop-shadow(0 15px 30px rgba(244, 114, 182, 0.12));
          }
          50% {
            filter: drop-shadow(0 15px 40px rgba(244, 114, 182, 0.2));
          }
        }
      `}</style>
    </div>
  );
};
