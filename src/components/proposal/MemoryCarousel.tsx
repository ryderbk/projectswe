import { useEffect, useState, useRef } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface MemoryCarouselProps {
  onContinue: () => void;
  photos?: string[]; // now optional
  captions?: string[]; // optional captions for each photo
}

export const MemoryCarousel = ({ onContinue, photos = [], captions = [] }: MemoryCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const revealRef = useRef(false);

  const SMOOTH = 550;

  // Ensure index is valid if photos change
  useEffect(() => {
    if (index >= photos.length) {
      setIndex(Math.max(0, photos.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length]);

  useEffect(() => {
    if (revealRef.current) return;
    revealRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  // Keyboard support: left / right to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (photos.length === 0) return;
      if (e.key === "ArrowRight") {
        setIndex((i) => (photos.length ? (i + 1) % photos.length : 0));
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);


  const nextPhoto = () => {
    if (photos.length === 0) return;
    if (index === photos.length - 1) {
      onContinue();
    } else {
      setIndex((i) => (i + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length === 0) return;
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  // --- EMPTY / FALLBACK UI ---
  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div
          className="fixed inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
          }}
        />
        <FloatingHearts />
        <div
          className="relative z-10 w-full max-w-md text-center"
          style={{
            transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <div className="glass-card p-8 rounded-2xl shadow-xl">
            <h2 className="font-serif text-2xl mb-4">No memories yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't added any photos to the memory carousel. You can continue for now.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={onContinue} className="btn-romantic">
                Continue
              </button>
              <button onClick={() => { /* optional: open uploader if you have one */ }} className="btn-secondary-romantic">
                Add Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- NORMAL UI ---
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
      />

      <FloatingHearts />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <h1 className="font-serif text-hero text-foreground mb-6">
          Our Little Memories 🤍
        </h1>

        {/* Polaroid Card */}
        <div className="bg-white shadow-2xl mb-10" style={{
          transform: "perspective(1000px) rotateY(-2deg) rotateX(2deg)",
          width: "100%",
          maxWidth: "320px",
          margin: "0 auto",
          aspectRatio: "3/4"
        }}>
          {/* Polaroid Image */}
          <div className="w-full h-2/3 overflow-hidden bg-white p-3">
            {photos[index]?.endsWith(".mp4") ? (
              <video
                key={photos[index]}
                src={photos[index]}
                autoPlay
                muted
                preload="auto"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={photos[index]}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // graceful fallback if image fails to load
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%23f8f4f6'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-family='Arial' font-size='24' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            )}
          </div>

          {/* Polaroid Caption */}
          <div className="h-1/3 bg-white flex items-center justify-center px-3 py-3">
            {captions[index] && (
              <p className="text-center text-foreground font-serif italic text-xs leading-relaxed">
                {captions[index]}
              </p>
            )}
          </div>

        </div>

        {/* Controls */}
        <div className="flex justify-between mt-8 w-full max-w-md">
          <button onClick={prevPhoto} className="btn-secondary-romantic px-6">
            ‹ Prev
          </button>
          <button onClick={nextPhoto} className="btn-secondary-romantic px-6">
            Next ›
          </button>
        </div>

        {/* Indicator */}
        <p className="text-muted-foreground text-sm mt-6">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
};

export default MemoryCarousel;
