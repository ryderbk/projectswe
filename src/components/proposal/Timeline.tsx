import { useEffect, useState, useRef } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface TimelineProps {
  onContinue: () => void;
}

export const Timeline = ({ onContinue }: TimelineProps) => {
  const [mounted, setMounted] = useState(false);
  const visibleRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (visibleRef.current) return;
    visibleRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  const events = [
    {
      title: "The First Time I Saw You",
      desc: "I didn’t know it then… but you were going to mean everything.",
    },
    {
      title: "Our First Conversation",
      desc: "Somewhere between your words… my heart decided it's you.",
    },
    {
      title: "The First ‘Hmm’ 🐼",
      desc: "Cutest sound I’ve ever heard. I swear.",
    },
    {
      title: "When I Realized I Love You",
      desc: "I started smiling randomly. That’s when I knew.",
    },
    {
      title: "Every Moment After",
      desc: "You’ve made my world feel like home.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
      />

      <FloatingHearts />

      {/* Content */}
      <div
        className="relative z-10 max-w-xl w-full text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        <h1 className="font-serif text-hero text-foreground mb-8">
          Our Cute Little Timeline 🤍
        </h1>

        <div className="glass-card p-8 rounded-2xl shadow-xl space-y-8">
          {events.map((e, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-3 h-3 rounded-full bg-primary mb-2" />
              <h3 className="font-serif text-xl text-foreground">{e.title}</h3>
              <p className="text-muted-foreground mt-1">{e.desc}</p>

              {i !== events.length - 1 && (
                <div className="w-1 h-12 bg-primary/20 rounded-full my-4" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="btn-romantic mt-10"
        >
          Next ❤️
        </button>
      </div>
    </div>
  );
};
