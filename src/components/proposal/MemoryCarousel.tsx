import { useEffect, useState, useRef, useCallback } from "react";
import { isMediaLoaded } from "@/utils/mediaPreloader";

interface MemoryCarouselProps {
  onContinue: () => void;
  photos?: string[];
  captions?: string[];
}

export const MemoryCarousel = ({ onContinue, photos = [], captions = [] }: MemoryCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [loadedMedia, setLoadedMedia] = useState<Set<number>>(new Set());
  const [carouselExiting, setCarouselExiting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const revealRef = useRef(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const SMOOTH = 550;
  const SLIDE_TRANSITION = 250;

  useEffect(() => {
    if (photos.length === 0) return;
    
    photos.forEach((src, i) => {
      if (src.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.src = src;
        video.onloadeddata = () => {
          setLoadedMedia(prev => new Set(prev).add(i));
        };
      } else {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setLoadedMedia(prev => new Set(prev).add(i));
        };
      }
    });
  }, [photos]);

  useEffect(() => {
    if (activeIndex >= photos.length) {
      setActiveIndex(Math.max(0, photos.length - 1));
    }
  }, [photos.length, activeIndex]);

  useEffect(() => {
    if (revealRef.current) return;
    revealRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (photos.length === 0 || isAnimating) return;
      if (e.key === "ArrowRight") {
        goToSlide((activeIndex + 1) % photos.length);
      } else if (e.key === "ArrowLeft") {
        goToSlide((activeIndex - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length, activeIndex, isAnimating]);

  const goToSlide = useCallback((newIndex: number) => {
    if (isAnimating || newIndex === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(newIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, SLIDE_TRANSITION);
  }, [isAnimating, activeIndex]);

  const nextPhoto = () => {
    if (photos.length === 0 || isAnimating) return;
    if (activeIndex === photos.length - 1) {
      setCarouselExiting(true);
      setTimeout(() => onContinue(), SMOOTH);
    } else {
      goToSlide(activeIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (photos.length === 0 || isAnimating) return;
    goToSlide((activeIndex - 1 + photos.length) % photos.length);
  };

  const handleVideoRef = (el: HTMLVideoElement | null, idx: number) => {
    if (el) {
      videoRefs.current.set(idx, el);
      if (idx === activeIndex) {
        el.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (idx === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

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
              <button onClick={() => {}} className="btn-secondary-romantic">
                Add Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentLoading = !loadedMedia.has(activeIndex) && !isMediaLoaded(photos[activeIndex]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 95%) 55%, hsl(30 100% 97%) 100%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-xl text-center"
        style={{
          transition: `opacity ${SMOOTH}ms cubic-bezier(.2,.9,.2,1), transform ${SMOOTH}ms cubic-bezier(.2,.9,.2,1)`,
          opacity: mounted && !carouselExiting ? 1 : 0,
          transform: mounted && !carouselExiting ? "translateY(0) scale(1)" : carouselExiting ? "translateY(-12px) scale(.97)" : "translateY(12px)",
        }}
      >
        <h1 className="font-serif text-hero text-foreground mb-6">
          Our Little Memories 🤍
        </h1>

        <div className="glass-card p-6 rounded-2xl shadow-xl mb-10">
          <div 
            className="w-full rounded-xl overflow-hidden soft-glow relative"
            style={{ aspectRatio: "4/3", backgroundColor: "transparent" }}
          >
            {photos.map((src, idx) => {
              const isActive = idx === activeIndex;
              const isVideo = src.endsWith(".mp4");
              
              return (
                <div
                  key={`media-${idx}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 2 : 1,
                    transition: `opacity ${SLIDE_TRANSITION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    pointerEvents: isActive ? "auto" : "none",
                    willChange: "opacity",
                  }}
                >
                  {isVideo ? (
                    <video
                      ref={(el) => handleVideoRef(el, idx)}
                      src={src}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#f8f4f6",
                      }}
                    />
                  ) : (
                    <img
                      src={src}
                      alt={`Memory ${idx + 1}`}
                      loading="eager"
                      decoding="sync"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#f8f4f6",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%23f8f4f6'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-family='Arial' font-size='24' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  )}
                </div>
              );
            })}
            
            {isCurrentLoading && !isAnimating && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  transition: "opacity 150ms ease",
                }}
              >
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div
            style={{
              minHeight: captions[activeIndex] ? "auto" : 0,
            }}
          >
            {captions[activeIndex] && (
              <p className="text-center text-foreground font-serif italic mt-4 mb-2 text-lg leading-relaxed tracking-wide">
                {captions[activeIndex]}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button 
              onClick={prevPhoto} 
              className="btn-secondary-romantic px-6"
              disabled={isAnimating}
            >
              ‹ Prev
            </button>
            <button 
              onClick={nextPhoto} 
              className="btn-secondary-romantic px-6"
              disabled={isAnimating}
            >
              Next ›
            </button>
          </div>

          <p className="text-muted-foreground text-sm mt-4 text-center">
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoryCarousel;
