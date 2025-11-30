// src/components/proposal/ProposalRevealStage.tsx
import { useEffect, useRef, useState } from "react";
import { Confetti } from "./Confetti";
import { AnimatedHeartSVG } from "./HeartIcon";
import { FloatingHearts } from "./FloatingHearts";

interface ProposalRevealStageProps {
  onAccept: () => void; // called only after YES flow completes
}

export const ProposalRevealStage = ({ onAccept }: ProposalRevealStageProps) => {
  const ANIM = 1200; // base animation duration (ms) — slow & cinematic

  // visible state for staged intro
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  // "NO" button state
  const [noClicked, setNoClicked] = useState(false);

  // Celebration
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // guard to avoid double accept
  const acceptedRef = useRef(false);
  const confettiPlayedRef = useRef(false);

  // Split headline into words so we can animate each word separately
  const HEADLINE = ["I", "LOVE", "YOU", "INFINITY"]; // heart will sit inline after THIS WORD

  useEffect(() => {
    // sequence: headline -> subtext -> buttons
    // small initial delay to allow page paint and avoid flicker (mount hidden then reveal)
    const t0 = window.setTimeout(() => setHeadlineVisible(true), 160);
    const t1 = window.setTimeout(() => setSubtextVisible(true), 920); // slow romantic reveal
    const t2 = window.setTimeout(() => setButtonsVisible(true), 1620);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleYes = () => {
    if (acceptedRef.current) return;
    acceptedRef.current = true;

    // hide buttons softly
    setButtonsVisible(false);

    // short pause then show celebration
    window.setTimeout(() => {
      setCelebrationVisible(true);

      // confetti + tiny chime (data URI) once
      if (!confettiPlayedRef.current) {
        confettiPlayedRef.current = true;
        setConfettiActive(true);

        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2JkI+LgHVpXmZxfYmVnpuUh3twZ2Rveo2dn52YjoN2bGVqdICQnZ6dlYyCdWtlaHF/jZqdnJaLgHVrZWlyfI+cnJqUin91amRocX6Nm5yblo2CdmtkZ3F9jZucm5aNgnVrZGhxfY2bnJuWjYJ1a2RocX2Nm5yblo2CdWtkZ3F9jZucm5aNgnVrZGhxfY2bnJuWjYJ2a2RocX2Nm5yblo2CdWtkaHF9jZucm5aNgnVrZGhxfY2bm5uWjYJ1a2RocX2Nm5ublo2CdWtkZ3F9jZubm5aNgnVrZGdxfY2bm5uWjYJ1a2RncX2Nm5ublo2CdWtkZ3F9jZubm5aNgnVrZGdxfY2bm5uWjYJ1"
        );
        audio.volume = 0.28;
        audio.play().catch(() => {});
      }

      // Let celebration be visible a bit, then call onAccept (so ProposalApp can show Final)
      window.setTimeout(() => {
        onAccept();
      }, 1500);
    }, 260);
  };

  // NO should only toggle the cheeky text; it must NOT advance pages
  const handleNo = () => {
    // toggle once; subsequent clicks do nothing but keep that text
    setNoClicked(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* soft romantic background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(350 100% 94% / 0.36) 0%, hsl(30 100% 97%) 72%)",
        }}
        aria-hidden
      />

      {/* confetti canvas */}
      <Confetti active={confettiActive} duration={3800} />

      {/* FLOATING HEARTS — ABOVE ALL ELEMENTS */}
      <div className="pointer-events-none fixed inset-0 z-[999]">
        <FloatingHearts />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Intro block */}
        {!celebrationVisible && (
          <>
            {/* Headline - each word animates slowly in a cinematic stagger */}
            <h1
              className="font-serif text-5xl md:text-6xl text-foreground mb-6 leading-tight inline-flex items-center justify-center"
              style={{
                // keep the container visually hidden until we begin animating to avoid flashes
                visibility: headlineVisible ? "visible" : "hidden",
                // allow words to wrap if needed but keep heart inline with them
                gap: "0.6rem",
              }}
            >
              {HEADLINE.map((word, i) => {
                // each word will have a staggered delay
                const delay = `${i * 350}ms`;
                return (
                  <span
                    key={i}
                    aria-hidden
                    style={{
                      display: "inline-block",
                      transform: headlineVisible ? "translateY(0) scale(1)" : "translateY(18px) scale(.98)",
                      opacity: headlineVisible ? 1 : 0,
                      transition: `opacity ${ANIM}ms cubic-bezier(.18,.9,.25,1) ${delay}, transform ${ANIM}ms cubic-bezier(.18,.9,.25,1) ${delay}`,
                      willChange: "opacity, transform",
                      marginRight: i === HEADLINE.length - 1 ? "0.4rem" : undefined,
                    }}
                  >
                    {word}
                  </span>
                );
              })}

              {/* Inline heart placed on the same line and animated slightly after the last word */}
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 54,
                  height: 54,
                  marginLeft: 6,
                  transform: headlineVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
                  opacity: headlineVisible ? 1 : 0,
                  transition: `opacity ${ANIM}ms cubic-bezier(.18,.9,.25,1) ${HEADLINE.length * 350}ms, transform ${ANIM}ms cubic-bezier(.18,.9,.25,1) ${HEADLINE.length * 350}ms`,
                }}
              >
                <AnimatedHeartSVG />
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="text-xl md:text-2xl text-muted-foreground mb-12"
              style={{
                transition: `opacity ${ANIM}ms ease ${ANIM * 0.08}ms, transform ${ANIM}ms ease ${ANIM * 0.08}ms`,
                opacity: subtextVisible ? 1 : 0,
                transform: subtextVisible ? "translateY(0)" : "translateY(8px)",
                willChange: "opacity, transform",
              }}
            >
              Will you be my Panda Bommai for life long?
            </p>

            {/* Buttons */}
            <div
              aria-live="polite"
              style={{
                transition: `opacity ${ANIM}ms ease ${ANIM * 0.12}ms, transform ${ANIM}ms ease ${ANIM * 0.12}ms`,
                opacity: buttonsVisible ? 1 : 0,
                transform: buttonsVisible ? "translateY(0)" : "translateY(12px)",
                pointerEvents: buttonsVisible ? "auto" : "none",
              }}
            >
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={handleYes}
                  className="btn-romantic text-xl px-10 py-5"
                  aria-label="Say Yes"
                >
                  Yes 💗
                </button>

                <button
                  onClick={handleNo}
                  className="btn-secondary-romantic px-7 py-4 text-base"
                  aria-label="Say No"
                >
                  {noClicked ? "You're 4 Months Late Chello😂" : "No"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Celebration view */}
        {celebrationVisible && (
          <div
            className="flex flex-col items-center gap-6"
            style={{
              transition: `opacity ${ANIM}ms ease, transform ${ANIM}ms ease`,
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <div className="w-40 h-40">
              <AnimatedHeartSVG />
            </div>

            <h2
              className="font-serif text-4xl md:text-6xl text-foreground"
              style={{
                transform: "translateY(0)",
              }}
            >
              She said YES! 💍
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalRevealStage;
