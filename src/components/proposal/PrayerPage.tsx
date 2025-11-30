// src/components/proposal/PrayerPage.tsx
import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface PrayerPageProps {
  onContinue: () => void;
}

export const PrayerPage = ({ onContinue }: PrayerPageProps) => {
  const [mounted, setMounted] = useState(false);
  const [personalWish, setPersonalWish] = useState("");
  const [saved, setSaved] = useState(false);
  const revealRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (revealRef.current) return;
    revealRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  const handleSave = () => {
    if (!personalWish.trim()) return;

    setSaved(true);

    // Continue after short pause
    setTimeout(() => {
      onContinue();
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

      {/* FloatingHearts — original placement (behind content) */}
      <FloatingHearts />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        {/* Heading with inline emoji kept on the same line */}
        <h1 className="font-serif text-hero text-foreground mb-6 whitespace-nowrap flex items-center justify-center gap-2">
          <span>A Small Prayer For Us</span>
          <span className="inline-flex items-center translate-y-[1px]">🙏</span>
        </h1>

        <div className="glass-card p-8 rounded-2xl shadow-xl mb-8">
          <p className="text-muted-foreground mb-4">
            I kept a little wish for our future. You can add one too — something
            small, silly, or serious.
          </p>

          <textarea
            value={personalWish}
            onChange={(e) => {
              setPersonalWish(e.target.value);
              if (saved) setSaved(false);
            }}
            placeholder="Write a wish for us (e.g. 'May we always laugh together')"
            className="w-full rounded-lg p-4 resize-none h-28 mb-4 shadow-inner focus:outline-none"
            style={{
              border: "1px solid rgba(16,24,40,0.06)",
              background: "rgba(255,255,255,0.9)",
            }}
          />

          <div className="flex justify-center items-center">
            <button
              onClick={handleSave}
              className={`btn-romantic px-6 py-3 transition-opacity ${
                !personalWish.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!personalWish.trim()}
            >
              Save Wish
            </button>
          </div>

          {saved && (
            <p
              className="text-primary font-medium mt-4"
              style={{ transition: `opacity ${SMOOTH}ms ease` }}
            >
              Wish saved ❤️ Sending it to our little time capsule...
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Thank you for being my person — this is our tiny promise.
        </p>
      </div>
    </div>
  );
};

export default PrayerPage;
