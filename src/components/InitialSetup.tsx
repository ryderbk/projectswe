import React, { useCallback, useRef } from "react";

interface InitialSetupProps {
  onContinue: (opts?: { fullscreenRequested: boolean }) => void;
  audioPath?: string;
}

export const InitialSetup: React.FC<InitialSetupProps> = ({
  onContinue,
  audioPath,
}) => {
  const pressedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const requestFullscreen = useCallback(async (): Promise<boolean> => {
    const el = document.documentElement as any;
    if (!el) return false;

    const request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (!request) return false;

    try {
      await request.call(el);
      return true;
    } catch {
      return false;
    }
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioPath) return false;

    try {
      if (!audioRef.current) {
        const a = new Audio(audioPath);
        a.loop = true;
        a.preload = "auto";
        a.volume = 0;
        audioRef.current = a;
      }

      const a = audioRef.current;
      await a.play();

      // Smooth fade-in
      let vol = 0;
      const target = 0.35;
      const step = target / 12;

      return new Promise<boolean>((resolve) => {
        const id = setInterval(() => {
          vol += step;
          if (!audioRef.current) {
            clearInterval(id);
            resolve(true);
            return;
          }
          audioRef.current.volume = Math.min(target, vol);

          if (vol >= target) {
            clearInterval(id);
            resolve(true);
          }
        }, 100);
      });
    } catch {
      return false;
    }
  }, [audioPath]);

  const handleStart = useCallback(async () => {
    if (pressedRef.current) return;
    pressedRef.current = true;

    const fsResult = await requestFullscreen();
    await playAudio();

    onContinue({ fullscreenRequested: !!fsResult });
  }, [onContinue, playAudio, requestFullscreen]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-page-gradient">
      <div className="max-w-lg w-full bg-white rounded-2xl p-10 shadow-lg text-center">
        {/* MAIN TITLE — kept clean */}
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
          Put on your headphones darling💝
        </h1>

        {/* REMOVED THE SMALL REPEATED TEXT */}

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleStart}
            className="btn-romantic px-8 py-4 rounded-full text-lg"
          >
            Start — with a song 🎶
          </button>
        </div>
      </div>
    </div>
  );
};
